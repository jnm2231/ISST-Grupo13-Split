package es.upm.dit.isst.splitit.controller;

import java.io.Serializable;
import java.net.URI;
import java.net.URISyntaxException;
import java.security.Key;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.crypto.SecretKey;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;

import es.upm.dit.isst.splitit.models.Gasto;
import es.upm.dit.isst.splitit.models.GrupodeGastos;
import es.upm.dit.isst.splitit.models.ParticipacionGasto;
import es.upm.dit.isst.splitit.models.Usuario;
import es.upm.dit.isst.splitit.models.UsuarioGrupo;
import es.upm.dit.isst.splitit.repository.GastoRepository;
import es.upm.dit.isst.splitit.repository.GrupodeGastosRepository;
import es.upm.dit.isst.splitit.repository.ParticipacionGastoRepository;
import es.upm.dit.isst.splitit.repository.UsuarioGrupoRepository;
import es.upm.dit.isst.splitit.repository.UsuarioRepository;
import es.upm.dit.isst.splitit.service.BalanceService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.transaction.Transactional;

@RestController
@RequestMapping("/myApi")
public class SplititController {

    private final GrupodeGastosRepository grupodeGastosRepository;
    private final GastoRepository gastoRepository;
    private final BalanceService balanceService;
    private final UsuarioGrupoRepository usuarioGrupoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ParticipacionGastoRepository participacionGastoRepository;

    public static final Logger log = LoggerFactory.getLogger(SplititController.class);

    private static final String SECRET_KEY = "mySuperSecretKey1234567890123456";


    // @Value("${app.jwt.secret}")
    // private String jwtSecret;

    public SplititController(GrupodeGastosRepository grupodeGastosRepository, GastoRepository gastoRepository, UsuarioRepository usuarioRepository, BalanceService balanceService, ParticipacionGastoRepository participacionGastoRepository, UsuarioGrupoRepository usuarioGrupoRepository) {
        this.grupodeGastosRepository = grupodeGastosRepository; //Tabla con los grupos de gastos
        this.gastoRepository = gastoRepository; //Tabla con los gastos
        this.usuarioRepository = usuarioRepository; //Tabla con los usuarios
        this.balanceService = balanceService; //Tabla para calcular balances y deudas
        this.participacionGastoRepository = participacionGastoRepository;//Tabla que indica que usuarios participan en que gastos
        this.usuarioGrupoRepository = usuarioGrupoRepository; //Tabla que indica que usuarios pertenecen a que grupos
    }

    /**
     * Endpoint para obtener todos los grupos de gastos.
     * @return Lista de todos los grupos de gastos.
     */
    @GetMapping("/grupos")
    public List<Map<String, Serializable>> readAll(@CookieValue(name = "token", required = false) String token) {
        // Extraer el token de la cookie
        if (token == null || token.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token no proporcionado o inválido");
        }

        // Validar y decodificar el token
        Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
        String usuarioId;
        try {
            usuarioId = Jwts.parser()
                .verifyWith((SecretKey) key)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token inválido o expirado");
        }

        log.info("Obteniendo todos los grupos de gastos para el usuario con ID: {}", usuarioId);

        // Buscar el usuario en la base de datos
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        // Obtener los grupos asociados al usuario
        List<UsuarioGrupo> relaciones = usuarioGrupoRepository.findByUsuario(usuario);
        List<GrupodeGastos> grupos = relaciones.stream()
                .map(UsuarioGrupo::getGrupo)
                .toList();

        // Definir constantes para claves
        final String KEY_ID = "id";
        final String KEY_NOMBRE = "nombre";
        final String KEY_NUMERO_DE_PERSONAS = "numeroDePersonas";
        final String KEY_OTROS_DATOS = "otrosDatos";

        // Construir y devolver la respuesta con el número de personas en cada grupo
        return grupos.stream()
                .map(grupo -> {
                    int numeroDePersonas = usuarioGrupoRepository.findByGrupoId(grupo.getId()).size();
                    return Map.of(
                        KEY_ID, grupo.getId(),
                        KEY_NOMBRE, grupo.getNombre(),
                        KEY_NUMERO_DE_PERSONAS, numeroDePersonas,
                        KEY_OTROS_DATOS, grupo // Puedes incluir otros datos del grupo aquí
                    );
                })
                .toList();
    }

    /**
     * Endpoint para crear un nuevo grupo de gastos.
     * @param newGrupodeGastos Objeto del grupo de gastos a crear.
     * @return ResponseEntity con el nuevo grupo de gastos creado.
     * @throws URISyntaxException Si la URI de la respuesta no puede ser creada.
     */
    @PostMapping("/grupos")
    public ResponseEntity<String> createGroup(@RequestBody Map<String, Object> groupData) throws URISyntaxException {
        log.info("Creando un nuevo grupo de gastos: {}", groupData);

        String groupName = (String) groupData.get("nombre");
        Object usuariosObj = groupData.get("usuarios");

        // Verificar que el grupo tiene un nombre
        if (groupName == null || groupName.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El nombre del grupo de gastos no puede estar vacío");
        }

        if (!(usuariosObj instanceof List<?>)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El formato de usuarios es incorrecto");
        }
        
        @SuppressWarnings("unchecked")
        List<Map<String, String>> usuarios = (List<Map<String, String>>) usuariosObj;

        if (groupName == null || groupName.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El nombre del grupo de gastos no puede estar vacío");
        }

        // Crear el grupo de gastos
        GrupodeGastos newGroup = new GrupodeGastos(groupName);
        GrupodeGastos savedGroup = grupodeGastosRepository.save(newGroup);

        // Asociar usuarios al grupo
        if (usuarios != null && !usuarios.isEmpty()) {
            for (Map<String, String> usuarioData : usuarios) {
                String usuarioNombre = usuarioData.get("nombre");
                String apodo = usuarioData.get("apodo");

                // Buscar el usuario en la base de datos
                Usuario usuario = usuarioRepository.findById(usuarioNombre)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, 
                                "Usuario no encontrado: " + usuarioNombre));

                // Crear la relación UsuarioGrupo
                UsuarioGrupo usuarioGrupo = new UsuarioGrupo(usuario, savedGroup, apodo);

                // Agregar la relación al grupo y al usuario
                savedGroup.addUsuarioGrupo(usuarioGrupo);
                usuario.addUsuarioGrupo(usuarioGrupo);
                usuarioGrupoRepository.save(usuarioGrupo); 
            }

            // Guardar el grupo actualizado con las relaciones
            grupodeGastosRepository.save(savedGroup);
        }
        
        return ResponseEntity.created(new URI("/myApi/grupos/" + savedGroup.getId())).body("Grupo de gastos creado con éxito.");
    }

    /**
     * Endpoint para obtener un grupo de gastos específico por ID.
     * @param id ID del grupo de gastos.
     * @return ResponseEntity con el grupo de gastos solicitado.
     */
    @GetMapping("/grupos/{id}")
    public ResponseEntity<GrupodeGastos> getGroupById(@PathVariable Integer id) {
        log.info("Obteniendo el grupo de gastos con ID: {}", id);

        // Buscar el grupo
        GrupodeGastos group = grupodeGastosRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Grupo de gastos no encontrado"));

        return ResponseEntity.ok(group);
    }
    
    /**
     * Endpoint para agregar un gasto completo a un grupo específico.
     * @param groupId ID del grupo al que se le añadirá el gasto.
     * @param gastoData Objeto con los detalles del gasto y sus participaciones.
     * @return ResponseEntity con el gasto y participaciones agregados.
     * @throws ResponseStatusException Si el grupo de gastos o algún usuario no existe.
     */
    @PostMapping("/grupos/{groupId}/gastos")
    @Transactional
    public ResponseEntity<String> addGastoToGroup(
            @PathVariable Integer groupId,
            @RequestBody Map<String, Object> gastoData) {
        log.info("Agregando un gasto completo al grupo con ID: {}", groupId);
        
        // Validar y extraer datos del gasto
        String concepto = (String) gastoData.get("concepto");
        Float importe = ((Number) gastoData.get("importe")).floatValue();
        String pagadopor = (String) gastoData.get("pagadopor");

        // Validar y convertir "participaciones" de forma segura
        Object participantesObj = gastoData.get("participantes");
        if (!(participantesObj instanceof List<?>)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El campo 'participantes' debe ser una lista");
        }
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> participantes = (List<Map<String, Object>>) participantesObj;

        if (concepto == null || importe == null || pagadopor == null || participantes == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Datos incompletos para el gasto");
        }

        // Buscar el grupo de gastos
        GrupodeGastos group = grupodeGastosRepository.findById(groupId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Grupo de gastos no encontrado"));

        // Crear y guardar el gasto
        Gasto gasto = new Gasto(concepto, importe, pagadopor, group);
        gastoRepository.save(gasto);

        // Crear y guardar los participantes
        for (Map<String, Object> participanteData : participantes) {
            String usuarioNombre = (String) participanteData.get("usuarioNombre");
            Float importeUsuario = ((Number) participanteData.get("importeUsuario")).floatValue();

            Usuario usuario = usuarioRepository.findById(usuarioNombre)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

            ParticipacionGasto participacion = new ParticipacionGasto(gasto, usuario, importeUsuario);
            participacionGastoRepository.save(participacion);
        }

        return ResponseEntity.status(HttpStatus.CREATED).body("Gasto y participaciones agregados correctamente.");
    }
    
    /**
     * Endpoint para obtener todos los usuarios.
     * @return Lista de todos los usuarios.
     */
    @GetMapping("/usuarios")
    public List<Usuario> getAllUsers() {
        log.info("Obteniendo todos los usuarios");
        return (List<Usuario>) usuarioRepository.findAll();
    }

    @GetMapping("/grupos/{groupId}/balances")
    public ResponseEntity<Map<String, Float>> getBalances(@PathVariable Integer groupId) {
        log.info("Calculando balances para el grupo con ID: {}", groupId);
        Map<String, Float> balances = balanceService.calcularBalances(groupId);
        return ResponseEntity.ok(balances);
    }

    @GetMapping("/gastos/{gastoId}")
    public List<ParticipacionGasto> getParticipaciones(@PathVariable Integer gastoId) {
        log.info("Calculando participantes en el gasto con ID: {}", gastoId);
        return  participacionGastoRepository.findByGastoId(gastoId);
    }
    
    @GetMapping("/grupos/{groupId}/usuarios")
    public ResponseEntity<List<String>> getUsuariosGrupo(@PathVariable Integer groupId) {
        log.info("Obteniendo usuarios del grupo con ID: {}", groupId);

        // Obtener las relaciones UsuarioGrupo para el grupo
        List<UsuarioGrupo> relaciones = usuarioGrupoRepository.findByGrupoId(groupId);

        // Extraer solo los nombres de los usuarios de las relaciones
        List<String> nombresUsuarios = relaciones.stream()
                .map(relacion -> relacion.getUsuario().getNombre())
                .toList();

        return ResponseEntity.ok(nombresUsuarios);
    }

    @PostMapping("/signup")
    public ResponseEntity<String> addUsuario(@RequestBody Map<String, String> userData) {
        log.info("Creando un nuevo usuario: {}", userData);

        String nombre = userData.get("nombre");
        String email = userData.get("email");
        String password = userData.get("password");
        String authProvider = userData.getOrDefault("authProvider", "local"); // por defecto "local"

        // Verificar que el usuario tiene un nombre
        if (nombre == null || nombre.isEmpty() || email == null || email.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Alguno de los valores estan vacíos");
        }

        // Si es usuario local, la contraseña es obligatoria, si es con Google no
        if ("local".equals(authProvider) && (password == null || password.isEmpty())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La contraseña es obligatoria para usuarios locales");
        }

        // Crear el nuevo usuario
        Usuario newUser = new Usuario(nombre,email,password,authProvider);
        usuarioRepository.save(newUser);

        return ResponseEntity.status(HttpStatus.CREATED).body("Usuario creado con éxito.");
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Map<String, String> userData) {
        log.info("Iniciando sesión para el usuario: {}", userData);

        String acceso = userData.get("acceso");
        String password = userData.get("password");

        // Verificar que el usuario tiene un nombre y contraseña
        if (acceso == null || acceso.isEmpty() || password == null || password.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Alguno de los valores estan vacíos");
        }

        // Buscar el usuario en la base de datos
        Usuario usuario = usuarioRepository.findByNombre(acceso)
        .or(() -> usuarioRepository.findByEmail(acceso))
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        // Verificar la contraseña
        if (!usuario.getPassword().equals(password)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Contraseña incorrecta");
        }
        Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
        
            String token = Jwts.builder()
        .subject(usuario.getNombre()) // Incluye el usuarioId en el token
        .signWith(key) // Usa una clave secreta
        .compact();

        ResponseCookie cookie = ResponseCookie.from("token", token)
        .httpOnly(true)
        .secure(true) // Solo en HTTPS
        .path("/")
        .sameSite("Lax")
        .maxAge(60 * 60 * 24) // 1 día
        .build();


        return ResponseEntity.ok()
        .header("Set-Cookie", cookie.toString())
        .body("Login correcto");
    }



    @GetMapping("/generateToken/{nombre}")
    public ResponseEntity<String> generateTestToken(@PathVariable String nombre) {
        // Clave secreta para firmar el token
        Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

        // Crear el token con el nombre proporcionado
        String token = Jwts.builder()
                .subject(nombre) // Usar el nombre proporcionado en la URL
                .signWith(key) // Firma el token con la clave secreta
                .compact();

        return ResponseEntity.ok(token);
    }
    @PostMapping("/gastos/{gastoId}/actualizar")
    @Transactional
    public ResponseEntity<String> actualizarGasto(
            @PathVariable Integer gastoId,
            @RequestBody Map<String, Object> gastoData) {
        log.info("Actualizando gasto con ID: {}", gastoId);
        log.info("Datos recibidos: {}", gastoData);
    
        // Buscar el gasto existente
        Gasto gasto = gastoRepository.findById(gastoId)
                .orElseThrow(() -> {
                    log.error("Gasto no encontrado con ID: {}", gastoId);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "Gasto no encontrado");
                });
        log.info("Gasto antes de actualizar: {}", gasto);
    
        // Actualizar campos del gasto si están presentes en el map
        if (gastoData.containsKey("concepto")) {
            log.info("Actualizando concepto a: {}", gastoData.get("concepto"));
            gasto.setConcepto((String) gastoData.get("concepto"));
        }
        if (gastoData.containsKey("pagadopor")) {
            log.info("Actualizando pagadopor a: {}", gastoData.get("pagadopor"));
            gasto.setPagadopor((String) gastoData.get("pagadopor"));
        }
    
        // Actualizar las participaciones si se proporciona la lista de participantes
        if (gastoData.containsKey("participantes")) {
            Object participantesObj = gastoData.get("participantes");
            if (!(participantesObj instanceof List<?>)) {
                log.error("El campo 'participantes' no es una lista");
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El campo 'participantes' debe ser una lista");
            }
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> participantes = (List<Map<String, Object>>) participantesObj;
            log.info("Participantes recibidos: {}", participantes);
    
            // Eliminar participaciones anteriores
            List<ParticipacionGasto> participacionesAntiguas = participacionGastoRepository.findByGastoId(gastoId);
            log.info("Participaciones antiguas a eliminar: {}", participacionesAntiguas.size());
            for (ParticipacionGasto p : participacionesAntiguas) {
                log.info("Eliminando participacion: gasto={}, usuario={}", p.getGasto().getId(), p.getUsuario().getNombre());
                participacionGastoRepository.delete(p);
            }
    
            // Crear nuevas participaciones y calcular la suma total
            float sumaImportes = 0f;
            for (Map<String, Object> participanteData : participantes) {
                Map<String, Object> usuarioMap = (Map<String, Object>) participanteData.get("usuario");
                String usuarioNombre;
                if (usuarioMap != null && usuarioMap.containsKey("nombre")) {
                    usuarioNombre = (String) usuarioMap.get("nombre");
                } else if (participanteData.containsKey("usuarioNombre")) {
                    usuarioNombre = (String) participanteData.get("usuarioNombre");
                } else {
                    log.error("Falta el nombre del usuario en la participación: {}", participanteData);
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Falta el nombre del usuario en la participación");
                }
    
                Float importeUsuario = participanteData.containsKey("importe")
                        ? ((Number) participanteData.get("importe")).floatValue()
                        : (participanteData.containsKey("importeUsuario")
                            ? ((Number) participanteData.get("importeUsuario")).floatValue()
                            : 0f);
    
                sumaImportes += importeUsuario;
                log.info("Nueva participacion: usuario={}, importe={}", usuarioNombre, importeUsuario);
    
                Usuario usuario = usuarioRepository.findById(usuarioNombre)
                        .orElseThrow(() -> {
                            log.error("Usuario no encontrado: {}", usuarioNombre);
                            return new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado: " + usuarioNombre);
                        });
    
                ParticipacionGasto nuevaParticipacion = new ParticipacionGasto(gasto, usuario, importeUsuario);
                participacionGastoRepository.save(nuevaParticipacion);
            }
            // Actualiza el importe total del gasto con la suma de los importes de las participaciones
            log.info("Suma de importes de participaciones: {}", sumaImportes);
            gasto.setImporte(sumaImportes);
        } else if (gastoData.containsKey("importe")) {
            // Si no se actualizan las participaciones pero sí el importe, actualiza el importe
            log.info("Actualizando importe del gasto a: {}", gastoData.get("importe"));
            gasto.setImporte(((Number) gastoData.get("importe")).floatValue());
        }
    
        // Guardar el gasto actualizado
        log.info("Gasto antes de guardar: {}", gasto);
        gastoRepository.save(gasto);
    
        log.info("Actualización completada para gasto con ID: {}", gastoId);
        return ResponseEntity.ok("Gasto y participaciones actualizados correctamente");
    }

    @GetMapping("/me")
    public ResponseEntity<String> getUserEmail(@RequestParam("userId") String userId) {
        log.info("Fetching email for userId: {}", userId);

        // Buscar el usuario en la base de datos por su nombre
        Usuario usuario = usuarioRepository.findByNombre(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        // Devolver el email del usuario
        return ResponseEntity.ok(usuario.getEmail());
    }

    
    @GetMapping("/grupos/{groupId}/deudas")
    public ResponseEntity<Map<String, Map<String, Float>>> getDetailedDebts(@PathVariable Integer groupId) {
        log.info("Calculando deudas detalladas para el grupo con ID: {}", groupId);
        Map<String, Map<String, Float>> detailedDebts = balanceService.calcularDeudasDetalladas(groupId);
        return ResponseEntity.ok(detailedDebts);
    }

    /**
     * Endpoint para añadir un nuevo participante a un grupo de gastos existente.
     * 
     * @param joinRequest Mapa con los datos necesarios para la unión (grupoId y
     *                    usuarioNombre)
     * @param token       Token de autenticación proporcionado en la cookie
     * @return ResponseEntity con mensaje de confirmación de la operación
     * @throws ResponseStatusException Si el token no es válido, el grupo no existe,
     *                                 el usuario no existe,
     *                                 o el usuario ya es miembro del grupo
     */
    @PostMapping("/grupos/join")
    @Transactional
    public ResponseEntity<String> joinGroup(@RequestBody Map<String, String> joinRequest,
            @CookieValue(name = "token", required = false) String token) {
        // Validar token
        if (token == null || token.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token no proporcionado o inválido");
        }

        // Validar parámetros de entrada
        String grupoId = joinRequest.get("grupoId");
        String usuarioNombre = joinRequest.get("usuarioNombre");
        String apodo = joinRequest.get("apodo");

        if (apodo == null || apodo.isEmpty()) {
            apodo = ""; //En caso de que no se proporcione un apodo, se asigna un valor vacío
        }

        if (grupoId == null || usuarioNombre == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "ID de grupo o nombre de usuario no proporcionados");
        }

        Integer groupId;
        try {
            groupId = Integer.parseInt(grupoId);
        } catch (NumberFormatException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ID de grupo inválido");
        }

        log.info("Usuario {} intentando unirse al grupo con ID: {}", usuarioNombre, groupId);

        // Buscar el grupo de gastos
        GrupodeGastos group = grupodeGastosRepository.findById(groupId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Grupo de gastos no encontrado"));

        // Buscar el usuario en la base de datos
        Usuario usuario = usuarioRepository.findById(usuarioNombre)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        // Verificar si el usuario ya es miembro del grupo
        boolean yaEsMiembro = usuarioGrupoRepository.findByUsuarioAndGrupo(usuario, group).isPresent();
        if (yaEsMiembro) {
            return ResponseEntity.badRequest().body("El usuario ya es miembro de este grupo");
        }

        // Crear la relación UsuarioGrupo
        UsuarioGrupo usuarioGrupo = new UsuarioGrupo(usuario, group, apodo);

        // Agregar la relación al grupo y al usuario
        group.addUsuarioGrupo(usuarioGrupo);
        usuario.addUsuarioGrupo(usuarioGrupo);
        usuarioGrupoRepository.save(usuarioGrupo);

        return ResponseEntity.ok("Usuario añadido al grupo correctamente.");
    }
}
package es.upm.dit.isst.splitit.controller;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import javax.crypto.SecretKey;

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

    public SplititController(GrupodeGastosRepository grupodeGastosRepository, GastoRepository gastoRepository, UsuarioRepository usuarioRepository, BalanceService balanceService, ParticipacionGastoRepository participacionGastoRepository, UsuarioGrupoRepository usuarioGrupoRepository) {
        this.grupodeGastosRepository = grupodeGastosRepository;
        this.gastoRepository = gastoRepository;
        this.usuarioRepository = usuarioRepository;
        this.balanceService = balanceService;
        this.participacionGastoRepository = participacionGastoRepository;
        this.usuarioGrupoRepository = usuarioGrupoRepository;
    }

    /**
     * Endpoint para obtener todos los grupos de gastos.
     * @return Lista de todos los grupos de gastos.
     */
    @GetMapping("/grupos")
    public List<GrupodeGastos> readAll(@CookieValue(name = "token", required = false) String token) {
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

        return grupos;
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
    public ResponseEntity<GrupodeGastos> getGroupById(
            @PathVariable Integer id,
            @CookieValue(name = "token", required = false) String token) {
        log.info("Obteniendo el grupo de gastos con ID: {}", id);

        // Validar token
        if (token == null || token.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token no proporcionado o inválido");
        }
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

        // Buscar el grupo
        GrupodeGastos group = grupodeGastosRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Grupo de gastos no encontrado"));

        // Buscar el usuario
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        // Comprobar si el usuario pertenece al grupo
        boolean pertenece = usuarioGrupoRepository.findByUsuarioAndGrupo(usuario, group).isPresent();
        if (!pertenece) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No tienes acceso a este grupo");
        }

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

        // Verificar que el usuario tiene un nombre
        if (nombre == null || nombre.isEmpty() || email == null || email.isEmpty() || password == null || password.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Alguno de los valores estan vacíos");
        }

        // Crear el nuevo usuario
        Usuario newUser = new Usuario(nombre,email,password);
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

}


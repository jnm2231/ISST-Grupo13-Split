package es.upm.dit.isst.splitit.controller;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import es.upm.dit.isst.splitit.models.Gasto;
import es.upm.dit.isst.splitit.models.GrupodeGastos;
import es.upm.dit.isst.splitit.models.ParticipacionGasto;
import es.upm.dit.isst.splitit.models.Usuario;
import es.upm.dit.isst.splitit.repository.GastoRepository;
import es.upm.dit.isst.splitit.repository.GrupodeGastosRepository;
import es.upm.dit.isst.splitit.repository.ParticipacionGastoRepository;
import es.upm.dit.isst.splitit.repository.UsuarioRepository;
import es.upm.dit.isst.splitit.service.BalanceService;
import jakarta.transaction.Transactional;

@RestController
@RequestMapping("/myApi")
public class SplititController {

    private final GrupodeGastosRepository grupodeGastosRepository;
    private final GastoRepository gastoRepository;
    private final BalanceService balanceService;
    private final UsuarioRepository usuarioRepository;
    private final ParticipacionGastoRepository participacionGastoRepository;

    public static final Logger log = LoggerFactory.getLogger(SplititController.class);

    public SplititController(GrupodeGastosRepository grupodeGastosRepository, GastoRepository gastoRepository, UsuarioRepository usuarioRepository, BalanceService balanceService, ParticipacionGastoRepository participacionGastoRepository) {
        this.grupodeGastosRepository = grupodeGastosRepository;
        this.gastoRepository = gastoRepository;
        this.usuarioRepository = usuarioRepository;
        this.balanceService = balanceService;
        this.participacionGastoRepository = participacionGastoRepository;
    }

    /**
     * Endpoint para obtener todos los grupos de gastos.
     * @return Lista de todos los grupos de gastos.
     */
    @GetMapping("/grupos")
    public List<GrupodeGastos> readAll() {
        log.info("Obteniendo todos los grupos de gastos");
        return (List<GrupodeGastos>) grupodeGastosRepository.findAll();
    }

    /**
     * Endpoint para crear un nuevo grupo de gastos.
     * @param newGrupodeGastos Objeto del grupo de gastos a crear.
     * @return ResponseEntity con el nuevo grupo de gastos creado.
     * @throws URISyntaxException Si la URI de la respuesta no puede ser creada.
     */
    @PostMapping("/grupos")
    public ResponseEntity<String> createGroup(@RequestBody GrupodeGastos newGrupodeGastos) throws URISyntaxException {
        log.info("Creando un nuevo grupo de gastos: {}", newGrupodeGastos);

        // Verificar que el grupo tiene un nombre
        if (newGrupodeGastos.getNombre() == null || newGrupodeGastos.getNombre().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El nombre del grupo de gastos no puede estar vacío");
        }

        GrupodeGastos result = grupodeGastosRepository.save(newGrupodeGastos);

        return ResponseEntity.created(new URI("/myApi/grupos/" + result.getId())).body("Grupo de gastos creado con éxito.");
    }

    /**
     * Endpoint para obtener un grupo de gastos específico por ID.
     * @param id ID del grupo de gastos.
     * @return ResponseEntity con el grupo de gastos solicitado.
     */
    @GetMapping("/grupos/{id}")
    public ResponseEntity<GrupodeGastos> getGroupById(@PathVariable Integer id) {
        log.info("Obteniendo el grupo de gastos con ID: {}", id);
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
        List<Map<String, Object>> participantes = (List<Map<String, Object>>) gastoData.get("participaciones");

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
            Float importeParticipacion = ((Number) participanteData.get("importe")).floatValue();

            Usuario usuario = usuarioRepository.findById(usuarioNombre)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

            ParticipacionGasto participacion = new ParticipacionGasto(gasto, usuario, importeParticipacion);
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
    
}


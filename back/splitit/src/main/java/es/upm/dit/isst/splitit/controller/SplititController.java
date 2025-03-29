package es.upm.dit.isst.splitit.controller;

import es.upm.dit.isst.splitit.models.Gasto;
import es.upm.dit.isst.splitit.models.GrupodeGastos;
import es.upm.dit.isst.splitit.models.Usuario;
import es.upm.dit.isst.splitit.repository.GastoRepository;
import es.upm.dit.isst.splitit.repository.GrupodeGastosRepository;
import es.upm.dit.isst.splitit.repository.UsuarioRepository;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

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

import jakarta.transaction.Transactional;

@RestController
@RequestMapping("/myApi")
public class SplititController {

    private final GrupodeGastosRepository grupodeGastosRepository;
    private final GastoRepository gastoRepository;
    private final UsuarioRepository usuarioRepository;

    public static final Logger log = LoggerFactory.getLogger(SplititController.class);

    // Inyección de dependencias
    public SplititController(GrupodeGastosRepository grupodeGastosRepository, GastoRepository gastoRepository, UsuarioRepository usuarioRepository){
        this.grupodeGastosRepository = grupodeGastosRepository;
        this.gastoRepository = gastoRepository;
        this.usuarioRepository = usuarioRepository;
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
     * Endpoint para agregar un gasto a un grupo específico.
     * @param groupId ID del grupo al que se le añadirá el gasto.
     * @param gasto Objeto con los detalles del gasto a agregar.
     * @return ResponseEntity con el gasto agregado.
     * @throws ResponseStatusException Si el grupo de gastos no existe.
     */
    @PostMapping("/grupos/{groupId}/gastos")
    @Transactional
    public ResponseEntity<String> addGastoToGroup(@PathVariable Integer groupId, @RequestBody Gasto gasto) {
        log.info("Agregando un gasto al grupo con ID: {}", groupId);

        // Buscar el grupo de gastos
        GrupodeGastos group = grupodeGastosRepository.findById(groupId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Grupo de gastos no encontrado"));

        // Asociar el gasto con el grupo
        gasto.setGrupo(group);

        // Guardar el gasto
        gastoRepository.save(gasto);

        return ResponseEntity.status(HttpStatus.CREATED).body("Gasto agregado correctamente al grupo de gastos.");
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
}

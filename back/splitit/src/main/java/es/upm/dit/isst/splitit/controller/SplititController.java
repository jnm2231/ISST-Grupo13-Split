package es.upm.dit.isst.splitit.controller;



import es.upm.dit.isst.splitit.models.GrupodeGastos;
import es.upm.dit.isst.splitit.repository.GrupodeGastosRepository;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;


import jakarta.transaction.Transactional;


@RestController
@RequestMapping("/myApi")
public class SplititController {

    private final GrupodeGastosRepository grupodeGastosRepository;
    public static final Logger log = LoggerFactory.getLogger(SplititController.class);
    public SplititController(GrupodeGastosRepository g){
        this.grupodeGastosRepository = g;
    }

    

    @GetMapping("/grupos")
    List<GrupodeGastos> readAll() {
        log.info("Obteniendo todos los grupos de gastos");
        return (List<GrupodeGastos>) grupodeGastosRepository.findAll();
    }

    @PostMapping("/grupos")
    public String postMethodName(@RequestBody GrupodeGastos newGrupodeGastos) throws URISyntaxException {
        //TODO: Comprobar el correcto funcionamiento del POST
        
        log.info("Creando un nuevo grupo de gastos: {}", newGrupodeGastos);

        GrupodeGastos result = grupodeGastosRepository.save(newGrupodeGastos);

        
        return ResponseEntity.created(new URI("/grupos/"+result.getNombre())).body(result).toString();
    }
    


    
}



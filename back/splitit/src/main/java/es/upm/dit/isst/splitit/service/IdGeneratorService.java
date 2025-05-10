package es.upm.dit.isst.splitit.service;

import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import es.upm.dit.isst.splitit.repository.GrupodeGastosRepository;

@Service
public class IdGeneratorService {

    @Autowired
    private GrupodeGastosRepository grupoDeGastosRepository;

    private final Random random = new Random();

    /**
     * Genera un ID único de 8 dígitos para un grupo de gastos.
     * @return Un ID único.
     */
    public Integer generateUniqueId() {
        Integer id;
        do {
            id = 10000000 + random.nextInt(90000000); // Genera un número entre 10000000 y 99999999
        } while (grupoDeGastosRepository.existsById(id)); // Verifica si el ID ya existe
        return id;
    }
}
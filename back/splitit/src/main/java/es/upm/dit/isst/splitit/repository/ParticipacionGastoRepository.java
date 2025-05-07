package es.upm.dit.isst.splitit.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import es.upm.dit.isst.splitit.models.ParticipacionGasto;
import es.upm.dit.isst.splitit.models.ParticipacionGastoId;

public interface ParticipacionGastoRepository extends CrudRepository<ParticipacionGasto, ParticipacionGastoId> {
    // Obtener todas las participaciones de un gasto por su ID
    List<ParticipacionGasto> findByGastoId(Integer gastoId);

}

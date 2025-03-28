package es.upm.dit.isst.splitit.repository;

import org.springframework.data.repository.CrudRepository;

import es.upm.dit.isst.splitit.models.ParticipacionGasto;
import es.upm.dit.isst.splitit.models.ParticipacionGastoId;

public interface ParticipacionGastoRepository extends CrudRepository<ParticipacionGasto, ParticipacionGastoId> {

}

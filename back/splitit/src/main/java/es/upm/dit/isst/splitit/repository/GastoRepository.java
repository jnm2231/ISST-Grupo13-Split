package es.upm.dit.isst.splitit.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import es.upm.dit.isst.splitit.models.Gasto;

public interface GastoRepository extends CrudRepository<Gasto, Integer> {
    // Obtener todos los gastos de un grupo por su ID
    List<Gasto> findByGrupoId(Integer grupoId);

    void flush();
}

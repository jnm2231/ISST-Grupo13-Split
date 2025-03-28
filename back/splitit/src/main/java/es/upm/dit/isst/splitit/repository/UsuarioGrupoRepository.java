package es.upm.dit.isst.splitit.repository;

import org.springframework.data.repository.CrudRepository;

import es.upm.dit.isst.splitit.models.UsuarioGrupo;
import es.upm.dit.isst.splitit.models.UsuarioGrupoId;

public interface UsuarioGrupoRepository extends CrudRepository<UsuarioGrupo, UsuarioGrupoId> {
    
}

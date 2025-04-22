package es.upm.dit.isst.splitit.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import es.upm.dit.isst.splitit.models.Usuario;
import es.upm.dit.isst.splitit.models.UsuarioGrupo;
import es.upm.dit.isst.splitit.models.UsuarioGrupoId;

public interface UsuarioGrupoRepository extends CrudRepository<UsuarioGrupo, UsuarioGrupoId> {
    // Obtener todos los miembros de un grupo por su ID
    List<UsuarioGrupo> findByGrupoId(Integer grupoId);
    List<UsuarioGrupo> findByUsuario(Usuario usuario);
}

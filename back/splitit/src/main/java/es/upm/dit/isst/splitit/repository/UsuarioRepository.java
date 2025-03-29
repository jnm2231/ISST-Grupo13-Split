package es.upm.dit.isst.splitit.repository;

import org.springframework.data.repository.CrudRepository;

import es.upm.dit.isst.splitit.models.Usuario;

public interface UsuarioRepository extends CrudRepository<Usuario, String> {
    
}

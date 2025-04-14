package es.upm.dit.isst.splitit.repository;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import es.upm.dit.isst.splitit.models.Usuario;

public interface UsuarioRepository extends CrudRepository<Usuario, String> {
    
    Optional<Usuario> findByEmail(String email);
    Optional<Usuario> findByNombre(String nombre);
}

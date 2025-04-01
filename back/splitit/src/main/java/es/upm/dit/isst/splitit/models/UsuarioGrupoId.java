package es.upm.dit.isst.splitit.models;

import java.io.Serializable;
import java.util.Objects;

/**
 * Clase que representa la clave primaria compuesta de UsuarioGrupo.
 */
public class UsuarioGrupoId implements Serializable {
    
    public String usuario; // Debe coincidir con el nombre del campo en UsuarioGrupo
    public Integer grupo;  // Debe coincidir con el nombre del campo en UsuarioGrupo

    // Constructor vacío necesario para JPA
    public UsuarioGrupoId() {}

    public UsuarioGrupoId(String usuario, Integer grupo) {
        this.usuario = usuario;
        this.grupo = grupo;
    }

    // Getters y Setters
    public String getUsuario() { 
        return usuario;
    }
    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }
    public Integer getGrupo() {
        return grupo;
    }
    public void setGrupo(Integer grupo) {
         this.grupo = grupo;
}

    // Implementamos equals() y hashCode()
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UsuarioGrupoId that = (UsuarioGrupoId) o;
        return Objects.equals(usuario, that.usuario) &&
               Objects.equals(grupo, that.grupo);
    }

    @Override
    public int hashCode() {
        return Objects.hash(usuario, grupo);
    }
}
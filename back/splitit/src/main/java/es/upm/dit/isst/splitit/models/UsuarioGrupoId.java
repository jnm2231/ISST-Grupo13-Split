package es.upm.dit.isst.splitit.models;

import java.io.Serializable;
import java.util.Objects;

/*
 * Esta clase representa la clave primaria compuesta de la tabla UsuarioGrupo.
 * La clave primaria está compuesta por el nombre del usuario y el id del grupo.
 */
public class UsuarioGrupoId implements Serializable {
    public String usuarioNombre;
    public Integer grupoId;

    // Constructor vacío (obligatorio para JPA)
    public UsuarioGrupoId() {}

    public UsuarioGrupoId(String usuarioNombre, Integer grupoId) {
        this.usuarioNombre = usuarioNombre;
        this.grupoId = grupoId;
    }

    // Getters y Setters
    public String getUsuarioNombre() { return usuarioNombre; }
    public void setUsuarioNombre(String usuarioNombre) { this.usuarioNombre = usuarioNombre; }

    public Integer getGrupoId() { return grupoId; }
    public void setGrupoId(Integer grupoId) { this.grupoId = grupoId; }

    // Implementamos equals() y hashCode()
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UsuarioGrupoId that = (UsuarioGrupoId) o;
        return Objects.equals(usuarioNombre, that.usuarioNombre) &&
               Objects.equals(grupoId, that.grupoId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(usuarioNombre, grupoId);
    }
}

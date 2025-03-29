package es.upm.dit.isst.splitit.models;

import java.io.Serializable;
import java.util.Objects;
/*
 * Esta clase representa la clave primaria compuesta de la tabla ParticipacionGasto.
 * La clave primaria está compuesta por el id del gasto y el nombre del usuario.
 */
public class ParticipacionGastoId implements Serializable {
    public Integer gastoId;
    public String usuarioNombre;

    public ParticipacionGastoId() {}

    /**
     * Constructor con parámetros.
     * @param gastoId
     * @param usuarioNombre
     */
    public ParticipacionGastoId(Integer gastoId, String usuarioNombre) {
        this.gastoId = gastoId;
        this.usuarioNombre = usuarioNombre;
    }

    // Getters, setters, equals, and hashCode
    public Integer getGastoId() { return gastoId; }
    public void setGastoId(Integer gastoId) { this.gastoId = gastoId; }

    public String getUsuarioNombre() { return usuarioNombre; }
    public void setUsuarioNombre(String usuarioNombre) { this.usuarioNombre = usuarioNombre; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ParticipacionGastoId that = (ParticipacionGastoId) o;
        return Objects.equals(gastoId, that.gastoId) &&
               Objects.equals(usuarioNombre, that.usuarioNombre);
    }

    @Override
    public int hashCode() {
        return Objects.hash(gastoId, usuarioNombre);
    }
}

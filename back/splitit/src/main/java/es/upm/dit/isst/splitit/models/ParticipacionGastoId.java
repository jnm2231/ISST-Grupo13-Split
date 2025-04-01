package es.upm.dit.isst.splitit.models;

import java.io.Serializable;
import java.util.Objects;
/*
 * Esta clase representa la clave primaria compuesta de la tabla ParticipacionGasto.
 * La clave primaria está compuesta por el id del gasto y el nombre del usuario.
 */
public class ParticipacionGastoId implements Serializable {
    private Integer gasto;
    private String usuario;

    public ParticipacionGastoId() {}

    /**
     * Constructor con parámetros.
     * @param gasto
     * @param usuario
     */
    public ParticipacionGastoId(Integer gasto, String usuario) {
        this.gasto = gasto;
        this.usuario = usuario;
    }

    // Getters, setters, equals, and hashCode
    public Integer getGasto() { 
        return gasto;
    }
    public void setGasto(Integer gasto) {
        this.gasto = gasto;
    }
    public String getUsuario() {
        return usuario;
    }
    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ParticipacionGastoId that = (ParticipacionGastoId) o;
        return Objects.equals(gasto, that.gasto) &&
               Objects.equals(usuario, that.usuario);
    }

    @Override
    public int hashCode() {
        return Objects.hash(gasto, usuario);
    }
}

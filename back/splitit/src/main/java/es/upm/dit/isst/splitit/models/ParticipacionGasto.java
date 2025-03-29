package es.upm.dit.isst.splitit.models;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "participacion_gasto")
@IdClass(ParticipacionGastoId.class)
public class ParticipacionGasto implements Serializable {

    @Id
    @Column(name = "gasto_id")
    private Integer gastoId;

    @Id
    @Column(name = "usuario_nombre")
    private String usuarioNombre;

    @ManyToOne
    @JoinColumn(name = "gasto_id", referencedColumnName = "id", insertable = false, updatable = false)
    private Gasto gasto;

    @ManyToOne
    @JoinColumn(name = "usuario_nombre", referencedColumnName = "nombre", insertable = false, updatable = false)
    private Usuario usuario;

    @Column(name = "importe")
    private Float importe;

    public ParticipacionGasto() {}

    /**
     * Constructor con parámetros.
     * @param gasto
     * @param usuario
     * @param importe
     */
    public ParticipacionGasto(Gasto gasto, Usuario usuario, Float importe) {
        this.gastoId = gasto.getId();
        this.usuarioNombre = usuario.getNombre();
        this.gasto = gasto;
        this.usuario = usuario;
        this.importe = importe;
    }

    // Getters and setters
    public Integer getGastoId() {
        return gastoId;
    }

    public void setGastoId(Integer gastoId) {
        this.gastoId = gastoId;
    }

    public String getUsuarioNombre() {
        return usuarioNombre;
    }

    public void setUsuarioNombre(String usuarioNombre) {
        this.usuarioNombre = usuarioNombre;
    }

    public Gasto getGasto() {
        return gasto;
    }

    public void setGasto(Gasto gasto) {
        this.gasto = gasto;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Float getImporte() {
        return importe;
    }

    public void setImporte(Float importe) {
        this.importe = importe;
    }
}

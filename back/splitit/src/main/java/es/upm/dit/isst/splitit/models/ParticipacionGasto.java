package es.upm.dit.isst.splitit.models;

import java.io.Serializable;
import java.util.Objects;

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
    @ManyToOne
    @JoinColumn(name = "gasto_id", referencedColumnName = "id", nullable = false)
    private Gasto gasto;

    @Id
    @ManyToOne
    @JoinColumn(name = "usuario_nombre", referencedColumnName = "nombre", nullable = false)
    private Usuario usuario;

    @Column(name = "importe")
    private Float importe;

    public ParticipacionGasto() {}

    public ParticipacionGasto(Gasto gasto, Usuario usuario, Float importe) {
        this.gasto = gasto;
        this.usuario = usuario;
        this.importe = importe;
    }

    // Getters and setters
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
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ParticipacionGasto that = (ParticipacionGasto) o;
        return Objects.equals(gasto, that.gasto) &&
               Objects.equals(usuario, that.usuario);
    }

    @Override
    public int hashCode() {
        return Objects.hash(gasto, usuario);
    }
}

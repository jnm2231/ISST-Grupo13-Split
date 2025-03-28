package es.upm.dit.isst.splitit.models;

import java.io.Serializable;
import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

/**
 * Representa un gasto dentro de un grupo de gastos.
 */
@Entity
@Table(name = "Gasto")
public class Gasto implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @NotEmpty
    @Column(nullable = false)
    private String concepto;

    @NotNull
    @Column(nullable = false)
    private Float importe;

    @NotNull
    @Column(nullable = false)
    private String pagadopor;

    @ManyToOne
    @JoinColumn(name = "grupo_id", nullable = false)
    @JsonBackReference
    private GrupodeGastos grupo;

    /**
     * Constructor vacío necesario para JPA.
     */
    public Gasto() {
    }

    /**
     * Constructor con parámetros.
     * @param concepto Concepto del gasto.
     * @param importe Monto del gasto.
     * @param pagadopor Persona que pagó el gasto.
     * @param grupo Grupo de gastos al que pertenece.
     */
    public Gasto(String concepto, Float importe, String pagadopor, GrupodeGastos grupo) {
        this.concepto = concepto;
        this.importe = importe;
        this.pagadopor = pagadopor;
        this.grupo = grupo;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getConcepto() {
        return concepto;
    }

    public void setConcepto(String concepto) {
        this.concepto = concepto;
    }

    public Float getImporte() {
        return importe;
    }

    public void setImporte(Float importe) {
        if (importe == null) {
            throw new IllegalArgumentException("El importe no puede ser nulo");
        }
        this.importe = importe;
    }

    public String getPagadopor() {
        return pagadopor;
    }

    public void setPagadopor(String pagadopor) {
        this.pagadopor = pagadopor;
    }

    public GrupodeGastos getGrupo() {
        return grupo;
    }

    public void setGrupo(GrupodeGastos grupo) {
        this.grupo = grupo;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Gasto gasto = (Gasto) o;
        return Objects.equals(id, gasto.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "Gasto{" +
                "id=" + id +
                ", concepto='" + concepto + '\'' +
                ", importe=" + importe +
                ", pagadopor='" + pagadopor + '\'' +
                ", grupo_id=" + (grupo != null ? grupo.getId() : "null") +
                '}';
    }
}
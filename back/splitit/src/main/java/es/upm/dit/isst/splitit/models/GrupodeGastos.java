package es.upm.dit.isst.splitit.models;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;

/**
 * Representa un grupo de gastos en la aplicación.
 * Un grupo puede tener múltiples gastos asociados.
 */
@Entity
@Table(name = "grupo_de_gastos")
public class GrupodeGastos implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @NotEmpty
    @Column(nullable = false)
    private String nombre;

    @OneToMany(mappedBy = "grupo", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference 
    private List<Gasto> gastos = new ArrayList<>();

    /**
     * Constructor vacío necesario para JPA.
     */
    public GrupodeGastos() {
    }

    /**
     * Constructor con parámetros.
     * @param nombre Nombre del grupo de gastos.
     */
    public GrupodeGastos(String nombre) {
        this.nombre = nombre;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public List<Gasto> getGastos() {
        return gastos;
    }

    public void setGastos(List<Gasto> gastos) {
        this.gastos = gastos;
    }

    public void addGasto(Gasto gasto) {
        gastos.add(gasto);
        gasto.setGrupo(this);
    }

    public void removeGasto(Gasto gasto) {
        gastos.remove(gasto);
        gasto.setGrupo(null);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        GrupodeGastos that = (GrupodeGastos) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "GrupodeGastos{" +
                "id=" + id +
                ", nombre='" + nombre + '\'' +
                ", gastos=" + gastos.size() +
                '}';
    }
}

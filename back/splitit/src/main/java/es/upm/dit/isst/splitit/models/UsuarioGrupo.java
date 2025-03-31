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

/**
 * Representa la relación de pertenencia de un usuario a un grupo de gastos.
 * Es una tabla intermedia entre Usuario y GrupoGasto.
 */
@Entity
@Table(name = "usuario_grupo")
@IdClass(UsuarioGrupoId.class) // Define que la clave primaria es compuesta
public class UsuarioGrupo implements Serializable {

    @Id
    @ManyToOne
    @JoinColumn(name = "usuario_nombre", referencedColumnName = "nombre", nullable = false)
    private Usuario usuario;

    @Id
    @ManyToOne
    @JoinColumn(name = "grupo_id", referencedColumnName = "id", nullable = false)
    private GrupodeGastos grupo;

    @Column(name = "apodo")
    private String apodo; // Apodo del usuario en el grupo (si lo tiene)

    // Constructor vacío necesario para JPA
    public UsuarioGrupo() {}

    // Constructor con parámetros
    public UsuarioGrupo(Usuario usuario, GrupodeGastos grupo, String apodo) {
        this.usuario = usuario;
        this.grupo = grupo;
        this.apodo = apodo;
    }

    // Getters y Setters
    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public GrupodeGastos getGrupo() {
        return grupo;
    }

    public void setGrupo(GrupodeGastos grupo) {
        this.grupo = grupo;
    }

    public String getApodo() {
        return apodo;
    }

    public void setApodo(String apodo) {
        this.apodo = apodo;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UsuarioGrupo that = (UsuarioGrupo) o;
        return Objects.equals(usuario, that.usuario) && Objects.equals(grupo, that.grupo);
    }

    @Override
    public int hashCode() {
        return Objects.hash(usuario, grupo);
    }
}
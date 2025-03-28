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
@IdClass(UsuarioGrupoId.class) //clave primaria compuesta
public class UsuarioGrupo implements Serializable {

    @Id
    @Column(name = "usuario_nombre")
    private String usuarioNombre;

    @Id
    @Column(name = "grupo_id")
    private Integer grupoId;

    @ManyToOne
    @JoinColumn(name = "usuario_nombre", referencedColumnName = "nombre", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "grupo_id", referencedColumnName = "id", nullable = false)
    private GrupodeGastos grupo;

    @Column(name = "apodo")
    private String apodo; // Apodo del usuario en el grupo (si lo tiene)

    /**
     * Constructor vacío necesario para JPA.
     */
    public UsuarioGrupo() {}

    /**
     * Constructor con parámetros.
     * @param usuario Usuario que pertenece al grupo.
     * @param grupo Grupo de gastos al que pertenece el usuario.
     * @param apodo Apodo del usuario en el grupo (opcional).
     */
    public UsuarioGrupo(Usuario usuario, GrupodeGastos grupo, String apodo) {
        this.usuarioNombre = usuario.getNombre();
        this.grupoId = grupo.getId();
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
            UsuarioGrupoId that = (UsuarioGrupoId) o;
            return Objects.equals(usuarioNombre, that.usuarioNombre) &&
                   Objects.equals(grupoId, that.grupoId);
        }

        @Override
        public int hashCode() {
            return Objects.hash(usuarioNombre, grupoId);
        }
}
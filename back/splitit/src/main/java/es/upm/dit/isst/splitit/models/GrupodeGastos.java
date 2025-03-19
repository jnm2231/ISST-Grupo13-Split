package es.upm.dit.isst.splitit.models;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotEmpty;


@Entity
@Table(name = "grupo_de_gastos")
public class GrupodeGastos implements Serializable{

@Id 
@GeneratedValue(strategy = GenerationType.AUTO)
private Integer ID;

@NotEmpty
@Column(nullable=false)
private String Nombre;

public GrupodeGastos() {
}

public GrupodeGastos(Integer iD, @NotEmpty String nombre) {
    ID = iD;
    Nombre = nombre;
}
public Integer getID() {
    return ID;
}
public void setID(Integer iD) {
    ID = iD;
}
public String getNombre() {
    return Nombre;
}
public void setNombre(String nombre) {
    Nombre = nombre;
}
@Override
public int hashCode() {
    final int prime = 31;
    int result = 1;
    result = prime * result + ((ID == null) ? 0 : ID.hashCode());
    result = prime * result + ((Nombre == null) ? 0 : Nombre.hashCode());
    return result;
}
@Override
public boolean equals(Object obj) {
    if (this == obj)
        return true;
    if (obj == null)
        return false;
    if (getClass() != obj.getClass())
        return false;
    GrupodeGastos other = (GrupodeGastos) obj;
    if (ID == null) {
        if (other.ID != null)
            return false;
    } else if (!ID.equals(other.ID))
        return false;
    if (Nombre == null) {
        if (other.Nombre != null)
            return false;
    } else if (!Nombre.equals(other.Nombre))
        return false;
    return true;
}
@Override
public String toString() {
    return "GrupodeGastos [ID=" + ID + ", Nombre=" + Nombre + "]";
}


}

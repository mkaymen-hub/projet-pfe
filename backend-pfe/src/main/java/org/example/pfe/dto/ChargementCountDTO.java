package org.example.pfe.dto;

public class ChargementCountDTO {
    private String nomFlux;
    private long total;

    public ChargementCountDTO(String nomFlux, long total) {
        this.nomFlux = nomFlux;
        this.total = total;
    }

    public String getNomFlux() {
        return nomFlux;
    }

    public void setNomFlux(String nomFlux) {
        this.nomFlux = nomFlux;
    }

    public long getTotal() {
        return total;
    }

    public void setTotal(long total) {
        this.total = total;
    }
}

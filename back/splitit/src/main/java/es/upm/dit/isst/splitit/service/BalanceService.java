package es.upm.dit.isst.splitit.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import es.upm.dit.isst.splitit.models.Gasto;
import es.upm.dit.isst.splitit.models.ParticipacionGasto;
import es.upm.dit.isst.splitit.models.UsuarioGrupo;
import es.upm.dit.isst.splitit.repository.GastoRepository;
import es.upm.dit.isst.splitit.repository.ParticipacionGastoRepository;
import es.upm.dit.isst.splitit.repository.UsuarioGrupoRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class BalanceService {

    private static final Logger log = LoggerFactory.getLogger(BalanceService.class);

    private final GastoRepository gastoRepository;
    private final ParticipacionGastoRepository participacionGastoRepository;
    private final UsuarioGrupoRepository usuarioGrupoRepository;

    public BalanceService(GastoRepository gastoRepository, 
                          ParticipacionGastoRepository participacionGastoRepository, 
                          UsuarioGrupoRepository usuarioGrupoRepository) {
        this.gastoRepository = gastoRepository;
        this.participacionGastoRepository = participacionGastoRepository;
        this.usuarioGrupoRepository = usuarioGrupoRepository;
    }

    /**
     * Calcula los balances de los miembros de un grupo.
     * @param groupId ID del grupo.
     * @return Un mapa con el balance de cada usuario.
     */
    public Map<String, Float> calcularBalances(Integer groupId) {
        log.info("Calculando balances para el grupo con ID: {}", groupId);

        List<Gasto> gastos = gastoRepository.findByGrupoId(groupId);

        // Obtener todos los miembros del grupo
        List<UsuarioGrupo> miembros = usuarioGrupoRepository.findByGrupoId(groupId);

        // Inicializar balances
        Map<String, Float> balances = new HashMap<>();
        for (UsuarioGrupo miembro : miembros) {
            balances.put(miembro.getUsuario().getNombre(), 0f);
        }

        log.info("Miembros del grupo: {}", balances.keySet());

        for (Gasto gasto : gastos) {
            String pagador = gasto.getPagadopor();
            Float importe = gasto.getImporte();

            log.info("Procesando gasto: ID={} | Concepto='{}' | Pagado por='{}' | Importe={}", 
                     gasto.getId(), gasto.getConcepto(), pagador, importe);

            List<ParticipacionGasto> participaciones = participacionGastoRepository.findByGastoId(gasto.getId());

            if (participaciones.isEmpty()) {
                log.warn("El gasto ID={} no tiene participantes registrados. Saltando este gasto.", gasto.getId());
                continue;
            }

            float divisionEquitativa = importe / participaciones.size();

            for (ParticipacionGasto participacion : participaciones) {
                String participante = participacion.getUsuario().getNombre();
                float nuevoBalance = balances.getOrDefault(participante, 0f) - divisionEquitativa;
                balances.put(participante, nuevoBalance);

                log.info("Usuario '{}' participa en el gasto. Debe pagar: {} | Nuevo balance: {}", 
                         participante, divisionEquitativa, nuevoBalance);
            }

            float nuevoBalancePagador = balances.getOrDefault(pagador, 0f) + importe;
            balances.put(pagador, nuevoBalancePagador);

            log.info("Pagador '{}' recibe el importe completo. Nuevo balance: {}", pagador, nuevoBalancePagador);
        }

        log.info("Balances finales calculados: {}", balances);
        return balances;
    }
}

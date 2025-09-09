import { NextResponse } from "next/server";

/**
 * Genera calendario con algoritmo round-robin
 * @param equipos lista de IDs de equipos
 * @param jornadas número de jornadas (38 para liga completa)
 */
function generarCalendario(equipos: number[], jornadas: number) {
  const n = equipos.length;

  // Si el número de equipos es impar, añadimos un "bye" (descanso)
  if (n % 2 !== 0) {
    equipos.push(-1); // -1 significa descanso
  }

  const totalEquipos = equipos.length;
  const partidosPorJornada = totalEquipos / 2;
  const calendario: { jornada: number; local: number; visitante: number }[] = [];

  // Round robin básico
  for (let jornada = 0; jornada < totalEquipos - 1; jornada++) {
    for (let i = 0; i < partidosPorJornada; i++) {
      const local = equipos[i];
      const visitante = equipos[totalEquipos - 1 - i];

      if (local !== -1 && visitante !== -1) {
        calendario.push({
          jornada: jornada + 1,
          local,
          visitante,
        });
      }
    }

    // Rotación de equipos (excepto el primero)
    equipos.splice(1, 0, equipos.pop()!);
  }

  // Si hay menos de 20 equipos, añadimos tercera y cuarta vuelta hasta 38 jornadas
  let jornadaExtra = 1;
  while (calendario.length < jornadas * (equipos.length / 2)) {
    calendario.forEach((match) => {
      calendario.push({
        jornada: totalEquipos - 1 + jornadaExtra,
        local: match.visitante,
        visitante: match.local,
      });
    });
    jornadaExtra++;
  }

  return calendario;
}

// ✅ Endpoint POST /api/calendar
export async function POST(req: Request) {
  const body = await req.json();
  const { equipos, jornadas } = body;

  if (!equipos || equipos.length < 2) {
    return NextResponse.json({ error: "Se necesitan al menos 2 equipos" }, { status: 400 });
  }

  const calendario = generarCalendario(equipos, jornadas || 38);
  return NextResponse.json({ calendario });
}

document.addEventListener('DOMContentLoaded', async () => {
  const jugadorSelect = document.getElementById('jugadorSelect');
  const campeonSelect = document.getElementById('campeonSelect');
  const guardarBtn = document.getElementById('guardarBtn');
  const mensaje = document.getElementById('mensaje');

  async function cargarJugadores() {
    const res = await fetch('/api/jugadores');
    const jugadores = await res.json();

    jugadorSelect.innerHTML = '<option value="">Seleccione jugador</option>';

    jugadores.forEach(jugador => {
      const option = document.createElement('option');
      option.value = jugador;
      option.textContent = jugador;
      jugadorSelect.appendChild(option);
    });
  }

  async function cargarEquipos() {
    const res = await fetch('/api/equipos-mundial');
    const equipos = await res.json();

    campeonSelect.innerHTML = '<option value="">Seleccione campeón</option>';

    equipos.forEach(equipo => {
      const option = document.createElement('option');
      option.value = equipo;
      option.textContent = equipo;
      campeonSelect.appendChild(option);
    });
  }

  jugadorSelect.addEventListener('change', async () => {
    const jugador = jugadorSelect.value;

    campeonSelect.value = '';
    mensaje.textContent = '';
    mensaje.className = '';

    if (!jugador) return;

    const res = await fetch(`/api/pronostico-campeon/${encodeURIComponent(jugador)}`);
    const data = await res.json();

    if (data && data.campeon) {
      campeonSelect.value = data.campeon;
    }
  });

  guardarBtn.addEventListener('click', async () => {
    const jugador = jugadorSelect.value;
    const campeon = campeonSelect.value;

    mensaje.className = '';
    mensaje.textContent = '';

    if (!jugador || !campeon) {
      mensaje.textContent = 'Seleccione jugador y elija campeón.';
      mensaje.classList.add('mensaje-error');
      return;
    }

    const res = await fetch('/api/pronostico-campeon', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jugador, campeon })
    });

    const data = await res.json();

    if (res.ok) {
      mensaje.textContent = 'Campeón guardado correctamente.';
      mensaje.classList.add('mensaje-exito');
    } else {
      mensaje.textContent = data.error || 'Error guardando campeón.';
      mensaje.classList.add('mensaje-error');
    }
  });

  await cargarJugadores();
  await cargarEquipos();
});

$(document).ready(function() {
    // Inicialización
    if (!localStorage.getItem('saldo')) localStorage.setItem('saldo', '60000');
    if (!localStorage.getItem('movs')) localStorage.setItem('movs', JSON.stringify([]));
    if (!localStorage.getItem('agenda')) localStorage.setItem('agenda', JSON.stringify([{n:"Juan Perez", a:"juan.p"}]));

    function refresh() {
        let s = parseInt(localStorage.getItem('saldo'));
        $('#main-balance').text('$' + s.toLocaleString('es-CL'));
    }

    // Login
    $('#loginForm').submit(function(e) {
        e.preventDefault();
        if ($('#email').val() === "profe@wallet.cl" && $('#password').val() === "Sence2026") {
            window.location.href = 'menu.html';
        } else {
            $('#alert-container').html('<div class="alert alert-danger">Datos incorrectos</div>');
        }
    });

    // Depósito
    $('#btn-confirm-depo').click(function() {
        let m = parseInt($('#monto-deposito').val());
        if (m > 0) {
            let s = parseInt(localStorage.getItem('saldo')) + m;
            localStorage.setItem('saldo', s);
            addHistory('Depósito', m, 'plus');
            $(this).hide(); $('#monto-deposito').hide(); $('#confirm-depo-box').fadeIn();
        }
    });

    // Agenda y Envíos
    $('#btn-show-add').click(() => $('#form-new-dest').slideToggle());
    $('#btn-save-dest').click(function() {
        let n = $('#new-n').val(), a = $('#new-a').val();
        if(n && a) {
            let agenda = JSON.parse(localStorage.getItem('agenda'));
            agenda.push({n, a});
            localStorage.setItem('agenda', JSON.stringify(agenda));
            location.reload();
        }
    });

    if ($('#lista-dest').length) {
        let agenda = JSON.parse(localStorage.getItem('agenda'));
        const colores = ['#1abc9c', '#3498db', '#9b59b6', '#e67e22', '#e74c3c'];
        agenda.forEach(c => {
            let color = colores[c.n.charCodeAt(0) % colores.length];
            $('#lista-dest').append(`<li class="list-group-item d-flex align-items-center dest-item" style="cursor:pointer; border:none; border-bottom:1px solid #eee"><div class="avatar-circle" style="background:${color}">${c.n[0]}</div><span class="small"><strong>${c.n}</strong> (${c.a})</span></li>`);
        });
    }

    $(document).on('click', '.dest-item', function() {
        $('.dest-item').removeClass('bg-light'); $(this).addClass('bg-light');
        $('#panel-monto-envio').fadeIn();
    });

    $('#search-dest').on('keyup', function() {
        let v = $(this).val().toLowerCase();
        $(".dest-item").filter(function() { $(this).toggle($(this).text().toLowerCase().indexOf(v) > -1); });
    });

    $('#btn-exec-send').click(function() {
        let m = parseInt($('#monto-envio').val()), s = parseInt(localStorage.getItem('saldo'));
        if (m > 0 && m <= s) {
            localStorage.setItem('saldo', s - m);
            addHistory('Transferencia', m, 'minus');
            $('#panel-monto-envio').hide(); $('#confirm-send-box').fadeIn();
        } else { alert("Saldo insuficiente"); }
    });

    // Historial
    function addHistory(tipo, monto, mod) {
        let movs = JSON.parse(localStorage.getItem('movs'));
        movs.push({ tipo, monto, mod, fecha: new Date().toLocaleDateString() });
        localStorage.setItem('movs', JSON.stringify(movs));
    }

    if ($('#history-container').length) {
        let movs = JSON.parse(localStorage.getItem('movs'));
        movs.reverse().forEach(m => {git push -u origin main --force
            let c = m.mod === 'plus' ? 'text-success' : 'text-danger';
            $('#history-container').append(`<div class="d-flex justify-content-between border-bottom py-2"><div class="small"><strong>${m.tipo}</strong><br>${m.fecha}</div><span class="${c} font-weight-bold">${m.mod==='plus'?'+':'-'}$${m.monto.toLocaleString()}</span></div>`);
        });
    }

    refresh();
});
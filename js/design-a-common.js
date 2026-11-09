/* ==========================================================
   Design A — Shared JavaScript
   Canvas starfield, menu overlay, shards, custom cursor.
   ========================================================== */

(function(){
  /* ---- Canvas starfield ---- */
  var c = document.getElementById('sky');
  if (!c) return;
  var x = c.getContext('2d');
  var W, H, stars = [];
  var still = matchMedia('(prefers-reduced-motion:reduce)').matches;

  function size() {
    W = c.width = innerWidth;
    H = c.height = innerHeight;
    stars = Array.from({length: Math.round(W * H / 9000)}, function() {
      return {x: Math.random()*W, y: Math.random()*H, r: Math.random()*1.6+.3, p: Math.random()*6.28, s: Math.random()*.02+.005, g: Math.random()<.08};
    });
  }

  function draw() {
    x.clearRect(0, 0, W, H);
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      s.p += s.s;
      var a = .45 + .55 * Math.sin(s.p);
      x.globalAlpha = a;
      x.fillStyle = s.g ? '#bcd6ff' : '#fff';
      if (s.g) { x.shadowColor = '#9cc4ff'; x.shadowBlur = 14; }
      else x.shadowBlur = 0;
      x.beginPath();
      x.arc(s.x, s.y, s.g ? s.r + 1.6 : s.r, 0, 6.28);
      x.fill();
    }
    x.globalAlpha = 1;
    if (!still) requestAnimationFrame(draw);
  }

  addEventListener('resize', size);
  size();
  draw();

  /* ---- Menu overlay ---- */
  var btn = document.getElementById('menuBtn');
  var ov = document.getElementById('overlay');
  if (btn && ov) {
    function setMenu(o) {
      document.body.classList.toggle('menu-open', o);
      ov.classList.toggle('open', o);
      ov.setAttribute('aria-hidden', !o);
      btn.setAttribute('aria-expanded', o);
      if (o) {
        var cb = document.getElementById('closeBtn');
        if (cb) cb.focus();
      }
    }
    btn.onclick = function() { setMenu(!ov.classList.contains('open')); };
    var closeBtn = document.getElementById('closeBtn');
    if (closeBtn) closeBtn.onclick = function() { setMenu(false); };
    ov.querySelectorAll('a').forEach(function(a) {
      a.onclick = function() { setMenu(false); };
    });
    addEventListener('keydown', function(e) {
      if (e.key === 'Escape') setMenu(false);
    });

    /* Floating photo pieces behind the menu */
    var sh = document.getElementById('shards');
    if (sh) {
      for (var i = 0; i < 26; i++) {
        var t = document.createElement('i');
        var s = 60 + Math.random() * 90;
        var angle = Math.random() * 6.28;
        var r = Math.random() * 230 + 30;
        t.className = 'tile';
        t.style.cssText = 'left:50%;top:46%;width:' + s + 'px;height:' + s + 'px;background-size:' + (300 + Math.random()*300) + '%;background-position:' + (Math.random()*100) + '% ' + (Math.random()*80) + '%;--x:' + (Math.cos(angle)*r*1.35-s/2) + 'px;--y:' + (Math.sin(angle)*r*1.5-s/2) + 'px;--r:' + (Math.random()*180-90) + 'deg;--o:' + (.1+Math.random()*.2) + ';--d:' + (i*.025).toFixed(2) + 's;--t:' + (6+Math.random()*6) + 's';
        sh.appendChild(t);
      }
    }
  }

  /* ---- Custom cursor ring ---- */
  if (matchMedia('(pointer:fine)').matches) {
    var cur = document.getElementById('cur');
    if (cur) {
      var mx = 0, my = 0, cx = 0, cy = 0;
      addEventListener('mousemove', function(e) {
        mx = e.clientX; my = e.clientY;
        cur.classList.add('on');
        document.body.classList.add('has-cur');
        cur.classList.toggle('big', !!e.target.closest('a,button'));
      });
      document.addEventListener('mouseleave', function() { cur.classList.remove('on'); });
      (function f() {
        cx += (mx - cx) * .18;
        cy += (my - cy) * .18;
        cur.style.transform = 'translate(' + cx + 'px,' + cy + 'px)';
        requestAnimationFrame(f);
      })();
    }
  }
})();

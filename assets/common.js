// common.js — появление секций и подсветка слов в tagline
(function(){
  var snap = location.search.indexOf('snap') !== -1;
  var reveals = document.querySelectorAll('.reveal');
  if(snap){ reveals.forEach(function(el){ el.classList.add('in'); }); }
  if('IntersectionObserver' in window){
    var ro = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add('in'); ro.unobserve(e.target); }
      });
    },{threshold:0.12});
    if(!snap){ reveals.forEach(function(el){ ro.observe(el); }); }
  } else {
    reveals.forEach(function(el){ el.classList.add('in'); });
  }

  var tag = document.querySelector('.tagline .h3');
  if(tag){
    var words = tag.textContent.trim().split(/\s+/);
    tag.innerHTML = words.map(function(w){ return '<span>'+w+'</span>'; }).join(' ');
    var spans = tag.querySelectorAll('span');
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduce){ spans.forEach(function(s){ s.classList.add('on'); }); }
    else {
      var to = new IntersectionObserver(function(entries){
        entries.forEach(function(e){
          if(e.isIntersecting){
            spans.forEach(function(s,i){ setTimeout(function(){ s.classList.add('on'); }, i*45); });
            to.unobserve(e.target);
          }
        });
      },{threshold:0.35});
      to.observe(tag);
    }
  }

  // проверка формы
  document.querySelectorAll('form[data-validate]').forEach(function(form){
    form.addEventListener('submit', function(ev){
      ev.preventDefault();
      var ok = true;
      form.querySelectorAll('[required]').forEach(function(input){
        var field = input.closest('.field');
        field.classList.remove('invalid');
        var v = (input.value || '').trim();
        var bad = !v;
        if(!bad && input.type === 'tel'){ bad = v.replace(/\D/g,'').length < 10; }
        if(bad){ field.classList.add('invalid'); ok = false; }
      });
      if(ok){
        var out = form.querySelector('.form-ok');
        if(out){ out.style.display = 'block'; }
        form.querySelectorAll('input,textarea,select,button').forEach(function(el){ el.disabled = true; });
      }
    });
  });
})();

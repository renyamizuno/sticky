var data;

$(function(){
  init();
});

function init(){
  marked.setOptions({
    langPrefix: ''
  });
  data = {"sticky":[]};
  var json = $.parseJSON(load());
  var d = json == null ? {
    "sticky":[]} : json;
  d['sticky'].forEach(function(sticky){
    create_sticky(sticky);
  });
  add_click();
  clear_click();
  search();
  hljs.initHighlightingOnLoad();
}

function add_click(){
  $('#add').click(function(){
    var sticky_obj = {
      'id': data['sticky'].length,
      'text': '',
      'left': '20',
      'top': '80',
      'yoko': '200',
      'tate': '100'
    };
    create_sticky(sticky_obj);
    save();
  });
}

function clear_click(){
  $('#clear').click(function() {
    localStorage.clear();
    $('#contents').html("");
    data = {"sticky":[]};
    save();
  });
}

function create_sticky(sticky){
  data['sticky'].push(sticky);
  if (sticky != null){
    var width = parseInt(sticky['yoko']) + 20;
    var height = parseInt(sticky['tate']) + 40;
    var textarea = $('<textarea>')
      .attr({placeholder: 'set Text'})
      .css({
        display: 'none'
      })
      .addClass('form-control')
      .text(sticky['text']);
    var delete_btn = $('<a>')
      .addClass('glyphicon glyphicon-remove delete_btn')
      .attr('href', 'javascript:void(0)');
    var view = $('<div>')
      .addClass('view')
      .html(marked(sticky['text']));
    var sticky = $('<div>').addClass('sticky')
      .attr({id: sticky['id']})
      .css({
        width: width,
        height: height,
        left: parseInt(sticky['left']),
        top: parseInt(sticky['top'])
      })
      .append(textarea)
      .append(delete_btn)
      .append(view)
      .appendTo('#contents');

    sticky.move_sticky();
    sticky.change_wh();
    sticky.editor_launch();
    sticky.focus_sticky();

    textarea.change_text();
    textarea.editor_close();
    textarea.change_tab();
    delete_btn.delete_click();
  }
}

function search(){
  $('#search').keyup(function(){
    var search_text = $('#search').val();
    if(search_text != ""){
      data['sticky'].forEach(function(sticky, index){
        if(sticky != null){
          if(sticky['text'].indexOf(search_text) != -1){
            $('#contents').children('#'+index).fadeIn(200);
          }
          else{
            $('#contents').children('#'+index).fadeOut(200);
          }
        }
      })
    }
    else{
      $('#contents').children().fadeIn(200);
    }
  });
}

$.fn.delete_click = function(){
  $(this).click(function() {
    var id = $(this).parent('.sticky').attr('id');
    $(this).parent('.sticky').html('').remove();
    data['sticky'][id] = null;
    save();
  });
}

$.fn.move_sticky = function(){
  $(this).draggable({
    connectToSortable: ".drop",
    stop: function(){
      var id = $(this).attr('id');
      data['sticky'][id]['left'] = $(this).css('left');
      data['sticky'][id]['top'] = $(this).css('top');
      save();
    }
  });
}

$.fn.change_text = function(){
  $(this).keyup(function(){
    var id = $(this).parent('.sticky').attr('id');
    data['sticky'][id]['text'] = $(this).val();
    save();
  });
}

$.fn.focus_sticky = function(){
  $(this).hover(function(){
    $('.sticky').css({zIndex: 0});
    $(this).css({zIndex: 100});
  });
}

$.fn.editor_launch = function(){
  $(this).click(function(){
    $(this).children('.view').css({
      display: 'none'
    });
    $(this).children('textarea').css({
      display: ''
    }).focus();
  });
}

$.fn.editor_close = function(){
  $(this).focusout(function(){
    $(this).css({
      display: 'none'
    });
    $(this).parent('.sticky').children('.view').css({
      display: ''
    }).html(marked($(this).val()));
    $('pre code').each(function(i, block) {
      hljs.highlightBlock(block);
    });
  });
}

$.fn.change_wh = function(){
  $(this).resizable({
    stop: function(){
      var id = $(this).attr('id');
      var w_now = $(this).width();
      var h_now = $(this).height();
      data['sticky'][id]['yoko'] = String(w_now);
      data['sticky'][id]['tate'] = String(h_now);
      save();
    }
  });
}

$.fn.change_tab = function(){
  $(this).keydown(tabKeyHandler);
}

function tabKeyHandler(e) {
    var TABKEY = 9;
    var v = '  ';
    if(e.keyCode == TABKEY) {
      var current_position = this.selectionStart;
      var end_position = this.selectionEnd;
      var text1 = $(this).val().substr(0, current_position);
      var text2 = $(this).val().substr(current_position);
      var value = text1 + '  ' + text2;
      $(this).val(value);
      this.selectionStart = current_position + 2;
      this.selectionEnd = end_position + 2;
      return false;
    }
}

//TODO:チームモード実装後変更する
function save(){
  localStorage.setItem('data',JSON.stringify(data));
}

function load(){
  return localStorage.getItem('data');
}

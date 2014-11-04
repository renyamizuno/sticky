var data;

$(function(){
  init();
});

function init(){
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
  return true;
}

function add_click(){
  $('#add').click(function() {
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
    var width = parseInt(sticky['yoko']);
    var height = parseInt(sticky['tate']);
    var textarea = $('<textarea>')
      .attr({placeholder: 'set Text'})
      .addClass('form-control')
      .width(width)
      .height(height)
      .text(sticky['text']);
    var delete_btn = $('<a>')
      .addClass('glyphicon glyphicon-remove delete_btn')
      .attr('href', 'javascript:void(0)');;
    var sticky = $('<div>').addClass('sticky')
      .attr({id: sticky['id']})
      .css({
        left: parseInt(sticky['left']),
        top: parseInt(sticky['top'])
      })
      .append(textarea)
      .append(delete_btn)
      .appendTo('#contents');

    sticky.move_sticky();
    textarea.change_text();
    textarea.change_wh();
    delete_btn.delete_click();
  }
}

function search(){
  $('#search').change(function() {
    var search_text = $('#search').val();
    if(search_text != ""){
      data['sticky'].forEach(function(sticky, index){
        if(sticky['text'].indexOf(search_text) != -1){
          $('#contents').children('#'+index).css({background: '#F00'});
        }
        else{
          $('#contents').children('#'+index).css({background: '#000'});
        }
      })
    }
    else{
      $('#contents').children().css({
        background: '#000'
      });
    }
  });
}

$.fn.delete_click = function(){
  $(this).click(function() {
    var id = $(this).parent('.sticky').attr('id');
    $(this).parent('.sticky').hide().html('');
    data['sticky'][id] = null;
    save();
  });
}

$.fn.move_sticky = function(){
  $(this).draggable({
    connectToSortable: ".drop",
    stop: function(){
      var id = $(this).attr('id');
      $('.sticky').attr('z-index', '0');
      $(this).attr('z-index', '100');
      data['sticky'][id]['left'] = $(this).css('left');
      data['sticky'][id]['top'] = $(this).css('top');
      save();
    }
  });
}

$.fn.change_text = function(){
  $(this).change(function() {
    var id = $(this).parent('.sticky').attr('id');
    data['sticky'][id]['text'] = $(this).val();
    save();
  });
}

$.fn.change_wh = function(){
  $(this).bind('mouseup', function(){
    var id = $(this).parent('.sticky').attr('id');
    var w_now = $(this).parent('.sticky').width();
    var h_now = $(this).parent('.sticky').height();
    data['sticky'][id]['yoko'] = String(w_now);
    data['sticky'][id]['tate'] = String(h_now);
    save();
  });
}


//TODO:チームモード実装後変更する
function save(){
  localStorage.setItem('data',JSON.stringify(data));
}

function load(){
  return localStorage.getItem('data');
}

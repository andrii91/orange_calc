$(document).ready(function () {
  var jsondata, calcData, myData = [], myDataSelect=[],
    projectData = [];

  function filterProjectInfo($tagProject, $myData) {

    var projectDataESTime = [],
      projectDataES;

    projectDataES = $myData.filter(function (item) {
      return item.tag.includes($tagProject);
    });


    for (var i = projectDataES.length - 1; i >= 0; i--) {
      projectDataESTime.push(projectDataES[i].time_tracked)

    }
    if (projectDataESTime.length > 0) {
      projectDataESTime = projectDataESTime.reduce(function (total, amount) {
        return total + amount;
      });
      projectData.push({
        'project': $tagProject,
        'time': projectDataESTime
      })

    } else {
      projectData.push({
        'project': $tagProject,
        'time': 0
      })

    }
  }




  var rounded = function (number) {
    return +number.toFixed(2);
  }

/*  var newDate = new Date();
  var days = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0).getDate() + 1;
  for (var i = days - 1; i >= 1; i--) {
   $('#date').append('<option value="' + (newDate.format("mm")) + '/' + formatDay(i) + '/' + newDate.format("yyyy") + '">' + formatDay(i) + '.' + newDate.format("mm") + '.' + newDate.format("yy") + '</option>')
  }

  function formatDay(day) {
    if (day < 10) day = "0" + day;
    return day;
  }

*/
function createOptionSelect(myDataSelect) {
  var myDataSelectNew = [];
  for (var i = myDataSelect.length - 1; i >= 0; i--) {
    const varS = myDataSelect[i].split(',');
    myDataSelectNew.push(varS[0])
  }


  function getUniqTags(tags) {
      var results = [];

      tags.forEach(function (value) {
          value = value.trim();

          if (results.indexOf(value) === -1) {
              results.push(value);
          }
      });

      return results; 
  }



  myDataSelectNew = getUniqTags(myDataSelectNew);
  myDataSelectNew = myDataSelectNew.sort();

  console.log(myDataSelectNew)

  for (var ik = myDataSelectNew.length - 1; ik >= 0; ik--) {
    

     $('#date').append('<option value="' + myDataSelectNew[ik] + '">' + myDataSelectNew[ik] + '</option>')

  }

}

  $('#addjson').click(function () {
    $(this).attr('disabled', 'disabled')
    jsondata = $(this).parent().find('textarea').val();


    calcData = JSON.parse(jsondata);

    for (var q = calcData.length - 1; q >= 0; q--) {

      myData.push({
        'task_id': calcData[q]['Task ID'],
        'user': calcData[q]['Username'],
        'user_id': calcData[q]['User ID'],
        'date': calcData[q]['Start'],
        'dateText': calcData[q]['Start Text'],
        'time_tracked': calcData[q]['Time Tracked'],
        'task_name': calcData[q]['Task Name'],
        'tag': calcData[q]['Tags'].toString() ? calcData[q]['Tags'].toString() : 'no-tag',

      })
    }

    for (var i = myData.length - 1; i >= 0; i--) {

      myDataSelect.push(myData[i].dateText);

      $('#calc tbody').append('<tr class="' + myData[i].task_id + '"><td class="userID" data-user_id="' + myData[i].user_id + '">' + myData[i].user + '</td> <td class="date_text">' + myData[i].dateText + '</td> <td class="time_tracked">' + myData[i].time_tracked + '</td> <td class="time_hour"><input type="number" class="time_hour-input form-control" value="' + rounded(myData[i].time_tracked / 3600000) + '" ></td><td>' + myData[i].task_name + '</td> <td>' + myData[i].tag + '</td><td><input width="50px" class="form-control h_summ" type="number" name="' + myData[i].task_id + '" value="0"></td><td class="summ summ_' + myData[i].task_id + '"></td></td><td><button class="btn my-btn btn-primary" data-id="' + myData[i].task_id + '">обьединить</button></td> </tr>')
    }


    /*формируем количество часов для разных проектов*/
    filterProjectInfo('ilc', myData);
    filterProjectInfo('es', myData);
    filterProjectInfo('orange', myData);
    filterProjectInfo('es app', myData);
    filterProjectInfo('rk web', myData);
    filterProjectInfo('rk app', myData);
    filterProjectInfo('chrome extension', myData);
    filterProjectInfo('shopify plugin', myData);
    filterProjectInfo('salsa', myData);
    filterProjectInfo('no-tag', myData);


    for (var i = projectData.length - 1; i >= 0; i--) {
      $('#projectTable tbody').append('<tr><td>' + projectData[i].project + '</td><td class="time_hour"><input type="number" class="time_hour-input form-control" value="' + rounded(projectData[i].time / 3600000) + '" ></td><td><input width="50px" class="form-control h_summ" type="number" name="' + projectData[i].project.replace(/\s/g, '') + '" value="0"></td> <td class="summ summ_' + projectData[i].project.replace(/\s/g, '') + '"></td> <td><input type="number" class="sales" value="0"><td class="sales_summ"></td></tr>')
    }


    createOptionSelect(myDataSelect);

    $('.sales').keyup(function(){
      const priceFull = Number($(this).parents('tr').find('.summ').text()),
            salesS = Number($(this).val());

      $(this).parents('tr').find('.sales_summ').text(rounded(priceFull - priceFull*salesS/100 ))
    })




    $('.my-btn').click(function () {
      var $from = $(this);

      var time_tracked_all = Number($from.find('.time_tracked').text());
      console.log($from.find('.time_tracked').text());

      $('.' + $from.data('id') + '').each(function () {
        time_tracked_all = time_tracked_all + Number($(this).find('.time_tracked').text())
        console.log('time_tracked_all', time_tracked_all)
      })

      $from.parents('tr').find('.time_tracked').text(time_tracked_all)
      if (dateFilter.length > 1) {

      } else {
        $from.parents('tr').find('.date_text').text('за все время')
      }
      $from.parents('tr').find('.time_hour input').val(rounded(time_tracked_all / 3600000))


      $('.' + $from.data('id') + '').removeClass('summ_complate').hide();

      $from.parents('tr').find('.summ').text(rounded((time_tracked_all / 3600000) * $from.parents('tr').find('input.h_summ').val()))

      $from.parents('tr').addClass('active-tr summ_complate');
      $from.hide();
    })

    $('input.h_summ[type="number"]').keyup(function () {
      $(this).parents('tr').find('.summ').text(rounded($(this).parents('tr').find('.time_hour input').val() * $(this).val()))
      $(this).parents('tr').addClass('summ_complate')
      // $('.allSumm-item').show();
      $('.allSumm-item').show();

    })

    $('#user_id input').change(function () {
      $('#calc td[data-user_id="' + $(this).attr('name') + '"]').parent().find('input.h_summ').val($(this).val())

      $('#calc td[data-user_id="' + $(this).attr('name') + '"]').parent().find('input.h_summ').each(function () {
        $(this).parents('tr').find('.summ').text(rounded($(this).parents('tr').find('.time_hour input').val() * $(this).val()))
        $(this).parents('tr').addClass('summ_complate')
        // $('.allSumm-item').show();
        $('.allSumm-item').show();
      })
    })

    $('select').change(function () {
      var filterUserSumm = $('#user').val();
      if ($('#user_id input[name="' + filterUserSumm + '"]').val() > 0) {

        $('#calc td[data-user_id="' + filterUserSumm + '"]').each(function(){
          $(this).parent().find('input.h_summ').val($('#user_id input[name="' + filterUserSumm + '"]').val());
        })

        $('#calc td[data-user_id="' + filterUserSumm + '"]').parent().find('input.h_summ').each(function () {
          $(this).parents('tr').find('.summ').text(rounded($(this).parents('tr').find('.time_hour input').val() * $(this).val()))
          $(this).parents('tr').addClass('summ_complate')

          $('.allSumm-item').show();
        })
      }
    })

    $('.time_hour-input').change(function () {
      $(this).attr('value', $(this).val())
      $(this).parents('tr').find('.summ').text(rounded($(this).val() * $(this).parents('tr').find('.h_summ').val()));
    })

  })




  /*  calcData = calcData.filter(function (item) {
        return item['User ID'] === 6849901;
    });*/

  /*
    calcData = calcData.filter(function (item) {
      return item['Start Text'].includes(dataFilter[0]);
    });
  */

  /*  var occurrences = {}
    var occurrencesTime = {}

    var filteredFamily = calcData.filter(function (x) {
      timeTrecker = timeTrecker + x['Time Tracked']
      if (occurrences[x['Task Name']]) {

        return false;
      }
      occurrencesTime[x['Task Name']] = timeTrecker;
      timeTrecker = 0;
      occurrences[x['Task Name']] = true;
      return true;
    })

  */




  var userID, dateFilter = '',
    projectFilter = '';


  $('#user').change(function () {
    userID = Number($(this).val());
    if (userID) {
      myDataFilter = myData.filter(function (item) {
        return item.user_id === userID;
      });

      if (dateFilter.length > 1) {
        myDataFilter = myDataFilter.filter(function (item) {
          return item.dateText.includes(dateFilter);
        });

      }

      if (projectFilter.length > 1) {
        myDataFilter = myDataFilter.filter(function (item) {
          return item.tag.includes(projectFilter);
        });

      }


      taskFilter();

    } else {
      myDataFilter = myData;

      if (dateFilter.length > 1) {
        myDataFilter = myDataFilter.filter(function (item) {
          return item.dateText.includes(dateFilter);
        });

      }

      if (projectFilter.length > 1) {
        myDataFilter = myDataFilter.filter(function (item) {
          return item.tag.includes(projectFilter);
        });

      }
      taskFilter();

    }

    taskFilterProject();


  });


  $('#date').change(function () {
    dateFilter = $(this).val();
    // dateFilter = dateFilter.split(',');

    console.log('dateFilter', dateFilter)
    if (dateFilter.length > 1) {
      myDataFilter = myData.filter(function (item) {
        return item.dateText.includes(dateFilter);
      });

      if (userID) {
        myDataFilter = myDataFilter.filter(function (item) {
          return item.user_id === userID;
        });

      }

      if (projectFilter.length > 1) {
        myDataFilter = myDataFilter.filter(function (item) {
          return item.tag.includes(projectFilter);
        });

      }


      taskFilter()
    } else {
      myDataFilter = myData;
      if (userID) {
        myDataFilter = myDataFilter.filter(function (item) {
          return item.user_id === userID;
        });

      }

      if (projectFilter.length > 1) {
        myDataFilter = myDataFilter.filter(function (item) {
          return item.tag.includes(projectFilter);
        });

      }


      taskFilter()
    }
    taskFilterProject();


  });


  $('#project').change(function () {
    projectFilter = $(this).val();


    console.log('projectFilter', projectFilter)
    if (projectFilter.length > 1) {
      myDataFilter = myData.filter(function (item) {
        return item.tag.includes(projectFilter);
      });

      if (userID) {
        myDataFilter = myDataFilter.filter(function (item) {
          return item.user_id === userID;
        });

      }

      if (dateFilter.length > 1) {
        myDataFilter = myDataFilter.filter(function (item) {
          return item.dateText.includes(dateFilter);
        });

      }

      taskFilter();


    } else {
      myDataFilter = myData;
      if (userID) {
        myDataFilter = myDataFilter.filter(function (item) {
          return item.user_id === userID;
        });

      }

      if (dateFilter.length > 1) {
        myDataFilter = myDataFilter.filter(function (item) {
          return item.dateText.includes(dateFilter);
        });

      }
      taskFilter();

    }

    taskFilterProject();


  });


  function taskFilter() {
    $('#calc tbody tr').remove();

    for (var iu = myDataFilter.length - 1; iu >= 0; iu--) {

      // $('#calc tbody').append('<tr class="' + myDataFilter[iu].task_id + '"><td>' + myDataFilter[iu].user + '</td> <td class="date_text">' + myDataFilter[iu].dateText + '</td> <td class="time_tracked">' + myDataFilter[iu].time_tracked + '</td> <td class="time_hour">' + rounded(myDataFilter[iu].time_tracked / 3600000) + '</td><td>' + myDataFilter[iu].task_name + '</td> <td>' + myDataFilter[iu].tag + '</td><td><button class="btn my-btn btn-primary" data-id="' + myDataFilter[iu].task_id + '">обьединить</button></td> </tr>')
      $('#calc tbody').append('<tr class="' + myDataFilter[iu].task_id + '"><td class="userID" data-user_id="' + myDataFilter[iu].user_id + '">' + myDataFilter[iu].user + '</td> <td class="date_text">' + myDataFilter[iu].dateText + '</td> <td class="time_tracked">' + myDataFilter[iu].time_tracked + '</td> <td class="time_hour"><input type="number" class="time_hour-input form-control" value="' + rounded(myDataFilter[iu].time_tracked / 3600000) + '" ></td><td>' + myDataFilter[iu].task_name + '</td> <td>' + myDataFilter[iu].tag + '</td><td><input width="50px" class="form-control h_summ" type="number" name="' + myDataFilter[iu].task_id + '" value="0"></td><td class="summ summ_' + myDataFilter[iu].task_id + '"></td></td><td><button class="btn my-btn btn-primary" data-id="' + myDataFilter[iu].task_id + '">обьединить</button></td> </tr>')
    }

    $('.allSumm-item span').each(function(){
        $(this).text('0');
    })





    $('.my-btn').click(function () {
      var $from = $(this);

      var time_tracked_all = Number($from.find('.time_tracked').text());
      console.log($from.find('.time_tracked').text());

      $('.' + $from.data('id') + '').each(function () {
        time_tracked_all = time_tracked_all + Number($(this).find('.time_tracked').text())
        console.log('time_tracked_all', time_tracked_all)
      })

      $from.parents('tr').find('.time_tracked').text(time_tracked_all)
      if (dateFilter.length > 1) {

      } else {
        $from.parents('tr').find('.date_text').text('за все время')
      }
      $from.parents('tr').find('.time_hour input').val(rounded(time_tracked_all / 3600000))


      $('.' + $from.data('id') + '').removeClass('summ_complate').hide();

      $from.parents('tr').find('.summ').text(rounded((time_tracked_all / 3600000) * $from.parents('tr').find('input.h_summ').val()))

      $from.parents('tr').addClass('active-tr summ_complate');
      $from.hide();
    })

    $('input.h_summ[type="number"]').keyup(function () {
      $(this).parents('tr').find('.summ_' + $(this).attr('name')).text(rounded($(this).parents('tr').find('.time_hour input').val() * $(this).val()))
      $(this).parents('tr').addClass('summ_complate')
      $('.allSumm-item').show();

    })




    $('select').change(function () {
      var filterUserSumm = $('#user').val();

      if ($('#user_id input[name="' + filterUserSumm + '"]').val() > 0) {

        $('#calc td[data-user_id="' + filterUserSumm + '"]').each(function(){
          $(this).parent().find('input.h_summ').val($('#user_id input[name="' + filterUserSumm + '"]').val());
        })

        $('#calc td[data-user_id="' + filterUserSumm + '"]').parent().find('input.h_summ').each(function () {
          $(this).parents('tr').find('.summ').text(rounded($(this).parents('tr').find('.time_hour input').val() * $(this).val()))
          $(this).parents('tr').addClass('summ_complate')

          $('.allSumm-item').show();
        })
      }

    })
    $('#user_id input').change(function () {
      $('#calc td[data-user_id="' + $(this).attr('name') + '"]').parent().find('input.h_summ').val($(this).val())

      $('#calc td[data-user_id="' + $(this).attr('name') + '"]').parent().find('input.h_summ').each(function () {
        $(this).parents('tr').find('.summ').text(rounded($(this).parents('tr').find('.time_hour input').val() * $(this).val()))
        $(this).parents('tr').addClass('summ_complate')
        // $('.allSumm-item').show();
        $('.allSumm-item').show();
      })
    })

    $('.time_hour-input').change(function () {
      $(this).attr('value', $(this).val())
      $(this).parents('tr').find('.summ').text(rounded($(this).val() * $(this).parents('tr').find('.h_summ').val()));
    })


    $('.sales').keyup(function(){
      const priceFull = Number($(this).parents('tr').find('.summ').text()),
            salesS = Number($(this).val());

      $(this).parents('tr').find('.sales_summ').text(rounded(priceFull - priceFull*salesS/100) )
    })


  }

  function taskFilterProject() {
    $('#projectTable tbody tr').remove();
    projectData = [];
    filterProjectInfo('es', myDataFilter);
    filterProjectInfo('ilc', myDataFilter);
    filterProjectInfo('orange', myDataFilter);
    filterProjectInfo('es app', myDataFilter);
    filterProjectInfo('rk web', myDataFilter);
    filterProjectInfo('rk app', myDataFilter);
    filterProjectInfo('chrome extension', myDataFilter);
    filterProjectInfo('shopify plugin', myDataFilter);
    filterProjectInfo('salsa', myDataFilter);
    filterProjectInfo('no-tag', myDataFilter);


    for (var i = projectData.length - 1; i >= 0; i--) {
       $('#projectTable tbody').append('<tr><td>' + projectData[i].project + '</td><td class="time_hour"><input type="number" class="time_hour-input form-control" value="' + rounded(projectData[i].time / 3600000) + '" ></td><td><input width="50px" class="form-control h_summ" type="number" name="' + projectData[i].project.replace(/\s/g, '') + '" value="0"></td> <td class="summ summ_' + projectData[i].project.replace(/\s/g, '') + '"></td> <td><input type="number" class="sales" value="0"><td class="sales_summ"></td></tr>')
    }


    $('input.h_summ[type="number"]').keyup(function () {
      $(this).parents('tr').find('.summ').text(rounded($(this).parents('tr').find('.time_hour input').val() * $(this).val()))
      $(this).parents('tr').addClass('summ_complate')
      $('.allSumm-item').show();

    })

    $('.time_hour-input').change(function () {
      $(this).attr('value', $(this).val())
      $(this).parents('tr').find('.summ').text(rounded($(this).val() * $(this).parents('tr').find('.h_summ').val()));
    })

    $('select').change(function () {
      var filterUserSumm = $('#user').val();
      if ($('#user_id input[name="' + filterUserSumm + '"]').val() > 0) {

        $('#calc td[data-user_id="' + filterUserSumm + '"]').each(function(){
          $(this).parent().find('input.h_summ').val($('#user_id input[name="' + filterUserSumm + '"]').val());
        })

        $('#calc td[data-user_id="' + filterUserSumm + '"]').parent().find('input.h_summ').each(function () {
          $(this).parents('tr').find('.summ').text(rounded($(this).parents('tr').find('.time_hour input').val() * $(this).val()))
          $(this).parents('tr').addClass('summ_complate')

          $('.allSumm-item').show();
        })
      }
    })


    $('#user_id input').change(function () {
      $('#calc td[data-user_id="' + $(this).attr('name') + '"]').parent().find('input.h_summ').val($(this).val())

      $('#calc td[data-user_id="' + $(this).attr('name') + '"]').parent().find('input.h_summ').each(function () {
        $(this).parents('tr').find('.summ').text(rounded($(this).parents('tr').find('.time_hour input').val() * $(this).val()))
        $(this).parents('tr').addClass('summ_complate')
        // $('.allSumm-item').show();
        $('.allSumm-item').show();
      })
    })
$('.sales').keyup(function(){
      const priceFull = Number($(this).parents('tr').find('.summ').text()),
            salesS = Number($(this).val());

      $(this).parents('tr').find('.sales_summ').text(rounded(priceFull - priceFull*salesS/100 ))
    })

  }

  $('#allSummBtn').click(function () {
    var summ_complate = 0,
      summ_clock = 0;
    $('#calc .summ_complate').each(function () {
      summ_complate = summ_complate + Number($(this).find('.summ').text())
      summ_clock = summ_clock + Number($(this).find('.time_hour-input').val())
    })

    $('#allSumm').text(rounded(summ_complate));
    $('#allClock').text(rounded(summ_clock) + " h");

  })



  $('.sales_input').keyup(function(){
    const priceFull = Number($(this).parents('.allSumm-item').find('#allSumm').text()),
            salesS = Number($(this).val());

      $(this).parents('.allSumm-item').find('#salesSumm').text(rounded(priceFull - priceFull*salesS/100 ))
  })


})

$(document).ready(function () {
  var rounded = function (number) {
    return +number.toFixed(2);
  }

  var newDate = new Date();
  var days = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0).getDate() + 1;
  for (var i = days - 1; i >= 1; i--) {
    $('#date').append('<option value="' + (newDate.format("mm")) + '/' + formatDay(i) + '/' + newDate.format("yyyy") + '">' + formatDay(i) + '.' + newDate.format("mm") + '.' + newDate.format("yy") + '</option>')
  }

  function formatDay(day) {
    if (day < 10) day = "0" + day;
    return day;
  }
  /*var filter = {
    user_id: 6849901,
    date: ,
  };*/
  // var timeTrecker = 0;
  var jsondata, calcData, myData = [];


  $('#addjson').click(function () {
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

      $('#calc tbody').append('<tr class="' + myData[i].task_id + '"><td>' + myData[i].user + '</td> <td class="date_text">' + myData[i].dateText + '</td> <td class="time_tracked">' + myData[i].time_tracked + '</td> <td class="time_hour">' + rounded(myData[i].time_tracked / 3600000) + '</td><td>' + myData[i].task_name + '</td> <td>' + myData[i].tag + '</td><td><button class="btn my-btn" data-id="' + myData[i].task_id + '">обьединить</button></td> </tr>')
    }


    $('.my-btn').click(function () {
      var $from = $(this);
      $from.parents('tr').addClass('active-tr');

      var time_tracked_all = Number($from.find('.time_tracked').text());
      console.log($from.find('.time_tracked').text());

      $('.' + $from.data('id') + '').each(function () {
        time_tracked_all = time_tracked_all + Number($(this).find('.time_tracked').text())
        console.log('time_tracked_all', time_tracked_all)
      })

      $from.parents('tr').find('.time_tracked').text(time_tracked_all)
      $from.parents('tr').find('.date_text').text('за все время')
      $from.parents('tr').find('.time_hour').text(rounded(time_tracked_all / 3600000))
      $('.' + $from.data('id') + '').hide();

      $from.hide();
    })

  })




  /*	calcData = calcData.filter(function (item) {
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

  });


  function taskFilter() {
    $('#calc tbody tr').remove();

    for (var iu = myDataFilter.length - 1; iu >= 0; iu--) {

      $('#calc tbody').append('<tr class="' + myDataFilter[iu].task_id + '"><td>' + myDataFilter[iu].user + '</td> <td class="date_text">' + myDataFilter[iu].dateText + '</td> <td class="time_tracked">' + myDataFilter[iu].time_tracked + '</td> <td class="time_hour">' + rounded(myDataFilter[iu].time_tracked / 3600000) + '</td><td>' + myDataFilter[iu].task_name + '</td> <td>' + myDataFilter[iu].tag + '</td><td><button class="btn my-btn" data-id="' + myDataFilter[iu].task_id + '">обьединить</button></td> </tr>')
    }



    $('.my-btn').click(function () {
      var $from = $(this);
      $from.parents('tr').addClass('active-tr');

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
      $from.parents('tr').find('.time_hour').text(rounded(time_tracked_all / 3600000))
      $('.' + $from.data('id') + '').hide();

      $from.hide();
    })
  }

})
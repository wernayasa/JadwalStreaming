let jadwalRilisRun = new BloggerScript();

(function () {
  const customFormat = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();

    hours = hours % 12;
    hours = hours ? hours : 12;

    minutes = minutes < 10 ? '0' + minutes : minutes;

    const amPm = hours >= 12 ? 'PM' : 'AM';

    const timeString = hours + ':' + minutes + ' ' + amPm;

    return timeString;
  };


  let a = document,
    b = window,
    jadwalRilis = a.getElementById('jadwalRilis'),
    days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
    day = new Date().getDay(),
    sortedDays = days.slice(day).concat(days.slice(0, day));
  if (!jadwalRilis) {
    return;
  }

  let html = `<div class='days mb-4 border-b border-gray-200 dark:border-gray-700'><ul class='flex flex-wrap -mb-px text-sm font-medium text-center' id='hari' data-tabs-toggle='#jadwal' role='tablist'>`,
    html2 = `<div id='jadwal' class='items'>`;
  sortedDays.forEach((item, index) => {
    let valu = item.toLowerCase();
    let check = index == 0 ? 'true' : 'false';
    html += `<li class='mr-2' role='presentation'><button class='inline-block p-4 border-b-2 rounded-t-lg' id='${valu}-tab' data-tabs-target='#${valu}' type='button' role='tab' aria-controls='${valu}' aria-selected='${check}'>${item}</button></li>`;
    html2 += `<div class='timeline hidden' id='${valu}' role='tabpanel' aria-labelledby='${valu}-tab'></div>`;
  });
  jadwalRilis.innerHTML = `${html}</ul></div>${html2}</div>`;

  sortedDays.forEach((item, index) => {
    let valu = item.toLowerCase();
    a.getElementById(`${valu}-tab`).addEventListener('click', (e) => {
      currentTar = e.currentTarget;
      if (currentTar.classList.contains('itemExist')) {
        return;
      }
      currentTar.classList.add('itemExist');
      a.getElementById(valu).innerHTML = '<p>Loading...</p>';

      /*
      Catatan
      url: https://www.blogger.com/feeds/9023265581606716045 
      bisa di ganti dengan 
      url: https://anime-la-bt.blogspot.com/feeds 
      */
      jadwalRilisRun.xhr('GET', `https://www.blogger.com/feeds/9023265581606716045/posts/default/-/${item.replace(/\&amp;/g,"&").replace(/\//g,"%2F")}?alt=json-in-script&max-results=150`, (e) => {
        if ('entry' in e.feed) {
          let feeds = jadwalRilisRun.getFeed(e),
            html = ``;

          feeds.forEach(item => {
            let epsName = item.label.find(i => i.match(/^Ep\s[0-9]{1}/gm)) || 'N/A',
              tipeName = item.label.find(i => ['TV', 'Movie', 'OVA', 'ONA'].includes(i)) || 'N/A',
              timeName = customFormat(new Date(item.updated)),
              timeNamev2 = item.label.find(i => i.match(/[0-9]{2}:[0-9]{2}/)) || timeName;
            html += `<div class='item'><div class='time'>${epsName}</div><div class='info'><a href='${item.link}' class='name' title='${item.title}'>`;

            if (tipeName == 'Movie') {
              html += `<span class='bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300'>${tipeName}</span>`;
            } else if (tipeName == 'OVA') {
              html += `<span class='bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300'>${tipeName}</span>`;
            } else if (tipeName == 'ONA') {
              html += `<span class='bg-yellow-100 text-yellow-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300'>${tipeName}</span>`;
            } else {
              html += `<span class='bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300'>${tipeName}</span>`;
            }

            html += `${item.title}</a></div><a class='watch'><i class='icon icon-caret-right'></i><time>${timeNamev2}</time></a></div>`;
          });
          a.getElementById(valu).innerHTML = html;
        } else {
          a.getElementById(valu).innerHTML = '<p>Nothing Post</p>';
        }
      })
    });
    if (index == 0) {
      a.getElementById(`${valu}-tab`).click();
    }
  });
})();
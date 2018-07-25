/*"permissions": ["activeTab", "<all_urls>"],*/
document.getElementById("findvideos").addEventListener('click', () => {
  console.log("Popup DOM fully loaded and parsed");

  function modifyDOM() {
      var videoStrings = [];
      var videos = document.getElementsByTagName("video");
      var i;
      for (i = 0; i < videos.length; i++) {
          console.log("Video Item:" + videos[i].currentSrc);
          videoStrings.push(videos[i].currentSrc);
      }
      return videoStrings;
  }

  //We have permission to access the activeTab, so we can call chrome.tabs.executeScript:
  chrome.tabs.executeScript({
      code: '(' + modifyDOM + ')();'
  }, (results) => {
      var table = document.getElementById("videosTable");

      // remove all rows in case the user has clicked multiple time in the same tab
      // we start at the second index because of the header
      for (let index = 1; index < table.rows.length; index++) {
        table.deleteRow(index);  
      }
      
      let count = 1;
      if (results) {
        results[0].forEach(element => {
          var row = table.insertRow(-1); // -1 represents last row
          var cell1 = row.insertCell(0);
          var cell2 = row.insertCell(1);
          var cell3 = row.insertCell(2);

          var x = document.createElement("A");
          var t = document.createTextNode(element);
          x.setAttribute("href", element);
          x.appendChild(t);
          if (x.pathname) {
            x.innerText = x.pathname;
          }

          var x1 = document.createElement("A");
          var t1 = document.createTextNode(element);
          x1.setAttribute("href", element);
          x1.setAttribute("download", "true");
          x1.setAttribute("class", "download-button");
          x1.appendChild(t1);
          x1.innerHTML = '<i class="download-i font-icon icon-download" >&#xe801;</i>';

          cell1.innerText = count;
          cell2.appendChild(x);
          cell3.appendChild(x1);
          count++;
        });
      }

      var warnEle = document.getElementById("no-videos-found");
      
      if (count === 1) {
        document.getElementById("warning-wrapper").innerHTML = '<div id="no-videos-found" style="margin: 5px;"><i class="font-icon icon-attention-alt">&#xf12a;</i>No Videos</div>';
      } else {
        document.getElementById("warning-wrapper").innerHTML = "";
      }
  });
});
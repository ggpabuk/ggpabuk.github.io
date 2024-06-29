
let steamid = document.getElementById("steamid");
steamid.addEventListener("input", updateValue);

let name = document.getElementById("name");
let role = document.getElementById("role");
let tag = document.getElementById("tag");
let ip = document.getElementById("ip");

function decodeBase64(encodedString) {
    // Проверяем, поддерживает ли браузер функцию atob
    if (window.atob) {
      return window.atob(encodedString);
    } else {
      // Полифилл для Internet Explorer
      var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
      var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
        ac = 0,
        dec = "",
        tmp_arr = [];
  
      if (!encodedString) {
        return encodedString;
      }
  
      encodedString += '';
  
      do {
        // Получаем 4 символа из строки в кодировке base64
        h1 = b64.indexOf(encodedString.charAt(i++));
        h2 = b64.indexOf(encodedString.charAt(i++));
        h3 = b64.indexOf(encodedString.charAt(i++));
        h4 = b64.indexOf(encodedString.charAt(i++));
  
        // Преобразуем символы в 6-битные числа
        bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;
  
        // Разбиваем 24-битное число на три 8-битных числа
        o1 = bits >> 16 & 0xff;
        o2 = bits >> 8 & 0xff;
        o3 = bits & 0xff;
  
        if (h3 == 64) {
          tmp_arr[ac++] = String.fromCharCode(o1);
        } else if (h4 == 64) {
          tmp_arr[ac++] = String.fromCharCode(o1, o2);
        } else {
          tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
        }
      } while (i < encodedString.length);
  
      dec = tmp_arr.join('');
  
      return decodeURIComponent(escape(dec));
    }
}
  
function numberToIp(number) {
    return [
        (number >> 24) & 255,
        (number >> 16) & 255,
        (number >> 8) & 255,
        number & 255
    ].join('.');
}

const formattedBreachTypes = [
    "Spectator",
    "Mtf",
    "Guard",
    "Class-D",
    "Scientist",
    "SCP-173",
    "SCP-049",
    "Chaos",
    "Janitor",
    "Worker",
    "SCP-939",
    "SCP-106",
    "SCP-966",
    "SCP-049-1",
    "SCP-096",
    "SCP-860-2",
    "SCP-035",
    "Clerk",
    "Lobby",
];
  
function getBreachType(index) {
    if (index < 0 || index >= formattedBreachTypes.length) {
      return 'Custom Role';
    }
    return formattedBreachTypes[index];
}

function updateValue(newval)
{
    if (newval.target.value == "")
    {
        name.textContent = "";
        role.textContent = "";
        tag.textContent = "";
        ip.textContent = "";
        return;
    }
    
    let xmlhttp = new XMLHttpRequest();
    
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let j = JSON.parse(this.responseText);
            name.textContent = (Date.now() / 1000 - j["last_seen"] > 30 ? "🔴" : "🟢") + decodeBase64(j["name"]);
            role.textContent = "Role: " + getBreachType(j["role"]);
            let tagStr = decodeBase64(j["tag"]);
            tag.innerHTML = tagStr.trim() == "" ? "No tag" : "Tag: <span style=\"color:" + "#" + j["tag_color"].toString(16) + "\">" + tagStr + "</span>";
            ip.textContent = numberToIp(j["last_ip"]) + ":" + j["last_port"];
        }
        else
        {
            name.textContent = "Not found.";
            role.textContent = "";
            tag.textContent = "";
            ip.textContent = "";
        }
    };
    xmlhttp.open("GET", "http://193.164.18.14/cbm/database/" + newval.target.value + ".json", true);
    xmlhttp.send();

}

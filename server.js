let url = require('url');
let path = require('path');
let fs = require('fs');
let mime = require('mime');

module.exports = function (request, response) {
  let url_obj = url.parse(request.url, true);
  let pathname = url_obj.pathname;

  // let realPath = pathname == '/' ? "/index.html" : pathname;
  let realPath = decodeURI(pathname);
  let project_path = path.normalize(__dirname + '/../');
  realPath = project_path + realPath;

  let ext = path.extname(realPath);
  ext = ext ? ext.slice(1) : 'unknow';
  let path_type = detectPath(realPath);

  if (isHtml(pathname)) {
    setGlobalParam(url_obj.query);
  }
  // 不存在
  if (!path_type) {
    response.writeHead(404, {
      'Content-Type': 'text/plain'
    });

    response.write(`This request URL ${realPath} was not found on this server.`);
    response.end();
    return true;
  }

  // file
  if (path_type == 'file') {
    fs.readFile(realPath, function (err, data) {
      if (err) {
        response.writeHead(500);
        return response.end('Error loading');
      }
      let contentType = mime.lookup(ext) || "text/plain";
      response.writeHead(200, {
        'Content-Type': contentType
      });
      response.end(data);
    });
    return true;
  }

  // folder
  fs.readdir(realPath, function (err, files) {
    response.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8'
    });
    let html = '<ul>';
    let server_path = realPath.replace(project_path, '');
    server_path = server_path == '/' ? '' : server_path;

    let parent_path = server_path + '/../';
    html += `<li><a href="${parent_path}">../</a></li>`;

    for (let i = 0; i < files.length; i++) {
      let file_path = `${server_path}/${files[i]}`;
      html += `<li><a href="${file_path}">${files[i]}</a></li>`;
    }
    html += '</ul>';
    response.end(html);
  });
};

function detectPath(path) {
  let stat;
  try {
    stat = fs.lstatSync(path);
  } catch (err) {
    console.log(err.message);
  }
  if (!stat) {
    return null;
  }

  if (stat.isFile()) {
    return 'file';
  } else if (stat.isDirectory()) {
    return 'directory';
  } else {}
}

function isHtml(pathname) {
  let html_file_list = ["index.html", "test_job.html", "test_home.html", "test_liu.html"];
  for (let i = 0; i < html_file_list.length; i++) {
    if (pathname.indexOf(html_file_list[i]) !== -1) {
      return true;
    }
  }
  return false;
}

function setGlobalParam(param) {
  if (!global.param) {
    global.param = {};
  }
  global.param.fish_type = param.fishType || param.fish;
  global.param.fish_num = param.fishNum;
}
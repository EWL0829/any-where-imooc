<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>{{title}}</title>
</head>
<body>
<ul class="link-wrap">
  {{#each files}}
    <li class="link-item">
      <a href='{{../dir}}/{{this}}'>{{this}}</a>
    </li>
  {{/each}}
</ul>
</body>
</html>

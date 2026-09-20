import urllib.request

resp = urllib.request.urlopen('http://localhost:8080/')
html = resp.read().decode('utf-8')
assert 'rel="icon"' in html, 'favicon rel missing'
assert 'favicon.svg' in html, 'favicon.svg missing'
assert 'cursor-dot' in html, 'cursor dot missing'
assert 'cursor-ring' in html, 'cursor ring missing'
assert 'brand-crest-icon' in html, 'brand crest icon missing'

f1 = urllib.request.urlopen('http://localhost:8080/assets/favicon.svg')
assert f1.status == 200
f2 = urllib.request.urlopen('http://localhost:8080/favicon.ico')
assert f2.status == 200
f3 = urllib.request.urlopen('http://localhost:8080/favicon.svg')
assert f3.status == 200

with open('css/style.css', encoding='utf-8') as f:
    css = f.read()
assert css.count('{') == css.count('}'), 'CSS brace mismatch'
assert '.brand-crest-icon' in css

print('ALL TAB, BAR, AND CURSOR CHECKS PASSED PERFECTLY!')

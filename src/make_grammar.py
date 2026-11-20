# -*- coding: utf-8 -*-
import json, sys
T = []
def topic(id, title, src, rule, items):
    T.append({'id': id, 'title': title, 'src': src, 'rule': rule, 'items': items})
def mc(q, a, w, e=''): return {'t': 'mc', 'q': q, 'a': a, 'w': w, 'e': e}
def od(s, e='', hint=''): return {'t': 'order', 's': s, 'e': e, 'hint': hint}

topic('possessiv', 'Possessivpronomen', 'Paremskaja S.46–48',
 ['mein / dein / sein / ihr / unser / euer / ihr / Ihr — притяжательные местоимения; склоняются как ein/kein.',
  'ich → mein, du → dein, er/es → sein, sie → ihr, wir → unser, ihr → euer, sie/Sie → ihr/Ihr.',
  'Женский род и мн. число: + -e (meine Mutter, meine Eltern). Akk. m.: meinen. Dat.: meinem/meiner/meinen.'],
 [mc('Das ist ___ Mutter. (ich)', 'meine', ['mein', 'meinen', 'meiner'], 'ich → mein-; Mutter — die, Nom. f. → meine.'),
  mc('Er liebt ___ Frau. (er)', 'seine', ['sein', 'ihre', 'seiner'], 'er → sein-; Frau — die, Akk. f. → seine.'),
  mc('Sie besucht ___ Eltern. (sie, она)', 'ihre', ['seine', 'ihr', 'ihren'], 'sie (она) → ihr-; Eltern — мн. ч., Akk. → ihre.'),
  mc('Wir haben ___ Auto verkauft. (wir)', 'unser', ['unsere', 'unseren', 'uns'], 'wir → unser-; das Auto — Akk. n. → unser (без окончания).'),
  mc('Hast du ___ Schlüssel? (du)', 'deinen', ['dein', 'deine', 'deinem'], 'du → dein-; der Schlüssel — Akk. m. → deinen.'),
  mc('Ich helfe ___ Bruder. (ich)', 'meinem', ['meinen', 'mein', 'meiner'], 'ich → mein-; helfen + Dativ; der Bruder — Dat. m. → meinem.'),
  mc('Ihr habt ___ Hausaufgaben gemacht. (ihr)', 'eure', ['euer', 'eures', 'euren'], 'ihr → euer-; Hausaufgaben — мн. ч. → eure (е перед -e выпадает): eure Hausaufgaben.')])

topic('komparativ', 'Komparativ und Superlativ', 'AB S.47, S.78 §9b, S.82; Panorama Kap.3',
 ['Komparativ: Adjektiv + -er (schnell → schneller). Superlativ: am + -sten (am schnellsten).',
  'Умлаут у многих односложных: alt → älter → am ältesten; groß → größer; jung → jünger.',
  'Неправильные: gut → besser → am besten; viel → mehr → am meisten; gern → lieber → am liebsten.',
  'Сравнение: so … wie (одинаково), Komparativ + als (больше).'],
 [mc('Mein Bruder ist ___ als ich.', 'älter', ['alter', 'ältere', 'am ältesten'], 'alt → älter (умлаут) + als.'),
  mc('Pizza schmeckt mir ___ als Suppe.', 'besser', ['guter', 'mehr', 'am besten'], 'gut → besser.'),
  mc('Das ist das ___ Haus der Stadt. (высокий)', 'höchste', ['höhere', 'hoch', 'am höchsten'], 'hoch → höher → höchst-; перед сущ. — das höchste Haus.'),
  mc('Er läuft ___ von allen.', 'am schnellsten', ['schneller', 'schnellste', 'am schneller'], 'Superlativ без существительного: am + -sten.'),
  mc('Sie ist so groß ___ ihr Vater.', 'wie', ['als', 'wann', 'das'], 'Одинаково: so … wie.'),
  mc('Ich trinke ___ Tee als Kaffee. (охотнее)', 'lieber', ['gerner', 'besser', 'mehr'], 'gern → lieber → am liebsten.'),
  mc('Diese Wohnung ist ___ als die andere. (дороже)', 'teurer', ['teuerer', 'teurere', 'am teuersten'], 'teuer → teurer (e выпадает).')])

topic('imperativ', 'Imperativ', 'AB S.47',
 ['du: корень без -st (Komm! Mach! Fahr!), у сильных с e→i — тоже (Lies! Sieh! Nimm!).',
  'ihr: как форма ihr без местоимения (Kommt! Macht!).',
  'Sie: инфинитив + Sie (Kommen Sie! Machen Sie!). wir: Gehen wir!',
  'sein: Sei! Seid! Seien Sie!  Умлаут не сохраняется: fahren → Fahr!'],
 [mc('___ bitte leise! (du, sein)', 'Sei', ['Bist', 'Sein', 'Seid'], 'sein → Sei!'),
  mc('___ mir bitte das Salz! (du, geben)', 'Gib', ['Gibst', 'Geb', 'Gebt'], 'geben → Gib! (e→i).'),
  mc('___ Sie bitte hier! (warten)', 'Warten', ['Wartet', 'Warte', 'Wartest'], 'Вежливая форма: инфинитив + Sie.'),
  mc('___ nicht so schnell! (du, fahren)', 'Fahr', ['Fähr', 'Fährst', 'Fahre'], 'Без умлаута: Fahr!'),
  mc('Kinder, ___ die Hände! (waschen)', 'wascht', ['wasch', 'waschen', 'wäscht'], 'ihr-форма без ihr: Wascht!'),
  mc('___ wir ins Kino! (gehen)', 'Gehen', ['Geht', 'Geh', 'Gehe'], 'wir-Imperativ: Gehen wir!')])

topic('passiv', 'Passiv Präsens', 'AB S.59',
 ['werden (в нужной форме) + Partizip II в конце: Das Gemüse wird geschnitten.',
  'ich werde, du wirst, er wird, wir werden, ihr werdet, sie werden.',
  'Действующее лицо (von + Dativ) обычно опускается.'],
 [mc('Die Suppe ___ gekocht.', 'wird', ['werden', 'wirst', 'ist'], 'die Suppe — 3 л. ед. ч. → wird.'),
  mc('Die Kartoffeln ___ geschält.', 'werden', ['wird', 'wirst', 'sind'], 'Kartoffeln — мн. ч. → werden.'),
  mc('Der Tisch wird ___.', 'gedeckt', ['decken', 'deckt', 'gedecken'], 'Passiv: werden + Partizip II (gedeckt).'),
  mc('Wie ___ der Kuchen gebacken?', 'wird', ['ist', 'hat', 'werden'], 'Вопрос: wird + Subjekt + Partizip II.'),
  od('Das Brot wird im Ofen gebacken.', 'Partizip II — в конце.')])

topic('komposita', 'Zusammengesetzte Nomen', 'AB S.53',
 ['Артикль определяется по последнему слову: der Tisch + die Lampe → die Tischlampe.',
  'Иногда между частями стоит -s- / -n- / -en-: die Wohnung + das Zimmer → das Wohnzimmer; der Geburtstag.',
  'Глагол + сущ.: schlafen + das Zimmer → das Schlafzimmer.'],
 [mc('Какой артикль у Kühlschrank (kühlen + der Schrank)?', 'der', ['die', 'das'], 'Последнее слово Schrank — der.'),
  mc('Какой артикль у Küchentisch?', 'der', ['die', 'das'], 'der Tisch → der Küchentisch.'),
  mc('Какой артикль у Waschmaschine (waschen + die Maschine)?', 'die', ['der', 'das'], 'die Maschine → die Waschmaschine.'),
  mc('Какой артикль у Schlafzimmer?', 'das', ['der', 'die'], 'das Zimmer → das Schlafzimmer.'),
  mc('Какой артикль у Fußballspiel?', 'das', ['der', 'die'], 'das Spiel → das Fußballspiel.'),
  mc('Какой артикль у Handtasche?', 'die', ['der', 'das'], 'die Tasche → die Handtasche.')])

topic('umzu', 'um … zu / damit', 'AB S.65–68',
 ['um … zu + Infinitiv — цель, когда подлежащее одно: Ich lerne, um die Prüfung zu bestehen.',
  'damit + Nebensatz — когда подлежащие разные: Ich lerne, damit meine Eltern stolz sind.',
  'Trennbar: um aufzustehen (zu между приставкой и глаголом).'],
 [mc('Ich gehe in die Stadt, ___ Schuhe zu kaufen.', 'um', ['damit', 'dass', 'weil'], 'Подлежащее одно → um … zu.'),
  mc('Ich erkläre es dir, ___ du es verstehst.', 'damit', ['um', 'dass zu', 'weil zu'], 'Разные подлежащие (ich / du) → damit.'),
  mc('Er steht früh auf, um den Bus ___ erreichen.', 'zu', ['zum', 'um', 'damit'], 'um … zu + Infinitiv.'),
  mc('Sie macht das Fenster auf, um ___.', 'frische Luft zu bekommen', ['frische Luft bekommt', 'zu frische Luft bekommen', 'dass frische Luft kommt'], 'zu + Infinitiv в конце.'),
  mc('Ich schreibe es auf, ___ ich es nicht vergesse.', 'damit', ['um', 'zu', 'dass um'], 'damit + Nebensatz (глагол в конце).'),
  od('Er spart Geld, um ein Auto zu kaufen.', 'um … zu: Infinitiv в конце.')])

topic('dass', 'Nebensatz mit dass', 'AB S.73 §23',
 ['dass — «что». В придаточном спрягаемый глагол стоит в конце.',
  'Ich glaube, dass er heute kommt.  Er sagt, dass er keine Zeit hat.',
  'Перед dass всегда запятая. Если Nebensatz стоит первым, за ним идёт глагол: Dass er kommt, freut mich.'],
 [od('Ich glaube, dass er heute kommt.', 'Глагол в придаточном — в конце.'),
  od('Sie sagt, dass sie keine Zeit hat.'),
  od('Ich weiß, dass du Deutsch lernst.'),
  od('Es ist schön, dass du hier bist.'),
  mc('Ich hoffe, ___ das Wetter gut wird.', 'dass', ['das', 'dasz', 'daß wird'], 'Союз dass (с двумя s).'),
  od('Er sagt, dass er morgen kommt.')])

topic('modal_prat', 'Modalverben im Präteritum', 'AB S.95–96; KB S.84; KB S.65, ÜB S.75–77 (2026-11-20)',
 ['können → konnte, müssen → musste, wollen → wollte, sollen → sollte, dürfen → durfte, mögen → mochte.',
  'Без умлаута. Окончания: ich/er -, du -st, wir/sie -n, ihr -t (ich konnte, du konntest, wir konnten).',
  'Infinitiv стоит в конце: Ich konnte gestern nicht kommen.'],
 [mc('Als Kind ___ ich nicht schwimmen. (können)', 'konnte', ['könnte', 'kannte', 'konnten'], 'können → konnte (без умлаута).'),
  mc('Gestern ___ wir arbeiten. (müssen)', 'mussten', ['müssten', 'musste', 'mussen'], 'wir → musste + n.'),
  mc('Er ___ nicht ins Kino gehen. (dürfen)', 'durfte', ['dürfte', 'durfet', 'darf'], 'dürfen → durfte.'),
  mc('Du ___ immer Pilot werden. (wollen)', 'wolltest', ['willst', 'wollte', 'wolltet'], 'du → wollte + st.'),
  mc('Ihr ___ pünktlich sein. (sollen)', 'solltet', ['sollten', 'sollt', 'sollte'], 'ihr → sollte + t.'),
  od('Ich musste gestern lange arbeiten.', 'Модальный глагол на 2-м месте, Infinitiv в конце.')])

topic('adjdekl', 'Adjektivdeklination', 'KB S.81–85; AB S.106',
 ['После der/die/das (определённый артикль): Nom. -e (der rote Tisch); Akk. m. -en; Dat. -en; мн.ч. -en.',
  'После ein/kein/mein: m. Nom. -er (ein roter Tisch), n. Nom./Akk. -es (ein rotes Auto), f. -e.',
  'Dativ: всегда -en (mit dem roten Auto, mit einer netten Frau).',
  'Совсем без артикля: окончание артикля (rote Rosen, kaltes Wasser).'],
 [mc('Das ist der ___ Tisch. (weiß)', 'weiße', ['weißen', 'weißer', 'weißes'], 'der + Nom. m. → -e.'),
  mc('Ich kaufe den ___ Tisch. (weiß)', 'weißen', ['weiße', 'weißer', 'weißes'], 'den (Akk. m.) → -en.'),
  mc('Wir wohnen in einem ___ Haus. (klein)', 'kleinen', ['kleines', 'kleine', 'kleiner'], 'Dativ → -en.'),
  mc('Das ist ein ___ Auto. (neu)', 'neues', ['neue', 'neuer', 'neuen'], 'ein + Nom. n. → -es.'),
  mc('Sie trägt eine ___ Jacke. (rot)', 'rote', ['rotes', 'roten', 'roter'], 'eine (Akk. f.) → -e.'),
  mc('Er hat einen ___ Hund. (groß)', 'großen', ['großer', 'großes', 'große'], 'einen (Akk. m.) → -en.'),
  mc('Mit den ___ Kindern spiele ich gern. (klein)', 'kleinen', ['kleine', 'kleiner', 'kleines'], 'Dativ Plural → -en.'),
  mc('Das ist ein ___ Mann. (nett)', 'netter', ['nette', 'netten', 'nettes'], 'ein + Nom. m. → -er.')])

topic('praesens', 'Präsens: regelmäßige und unregelmäßige Verben, sein / haben', 'Grammatik A1 S.24–33',
 ['Окончания: ich -e, du -st, er/sie/es -t, wir -en, ihr -t, sie/Sie -en.',
  'Вокальные изменения (du/er): a→ä (fahren: du fährst), e→i (sprechen: du sprichst), e→ie (lesen: du liest).',
  'sein: bin, bist, ist, sind, seid, sind. haben: habe, hast, hat, haben, habt, haben.'],
 [mc('Du ___ sehr schnell. (fahren)', 'fährst', ['fahrst', 'fährt', 'fahrt'], 'fahren: du fährst (a→ä).'),
  mc('Er ___ gut Deutsch. (sprechen)', 'spricht', ['sprecht', 'sprechst', 'sprächt'], 'e→i: er spricht.'),
  mc('Er ___ ein Buch. (lesen)', 'liest', ['lest', 'lesst', 'liesst'], 'e→ie: er liest.'),
  mc('Wir ___ müde. (sein)', 'sind', ['seid', 'bin', 'ist'], 'wir sind.'),
  mc('Ihr ___ viel Zeit. (haben)', 'habt', ['haben', 'hat', 'hast'], 'ihr habt.'),
  mc('Er ___ am Wochenende lange. (schlafen)', 'schläft', ['schlaft', 'schlafst', 'schlaf'], 'a→ä: er schläft.'),
  mc('Du ___ im Büro. (arbeiten)', 'arbeitest', ['arbeitst', 'arbeitet', 'arbeiten'], 'Корень на -t → du arbeitest.')])

topic('trennbar', 'Trennbare Verben', 'Grammatik A1 S.34–36',
 ['Приставка отделяется и уходит в конец предложения: aufstehen → Ich stehe um 7 Uhr auf.',
  'С модальным глаголом — не отделяется: Ich muss früh aufstehen.',
  'Partizip II: aufgestanden, eingekauft; с zu: aufzustehen.',
  'Приставки: an-, auf-, aus-, ein-, mit-, vor-, zu-, zurück-, fern-…'],
 [od('Ich stehe um sieben Uhr auf.', 'Приставка — в конце.'),
  od('Er kauft im Supermarkt ein.'),
  od('Der Zug kommt um acht Uhr an.'),
  od('Ich muss früh aufstehen.', 'С модальным глаголом глагол не разделяется.'),
  mc('Wann rufst du mich ___? (anrufen)', 'an', ['auf', 'ab', 'zu'], 'Приставка an- уходит в конец: rufst … an.'),
  mc('Partizip II от aufstehen:', 'aufgestanden', ['gestanden auf', 'aufstanden', 'aufgestehen'], 'auf + ge + stand + en.')])

topic('reflexiv', 'Reflexive Verben', 'AB S.118–122; Reflexivpronomen',
 ['ich → mich, du → dich, er/es/sie → sich, wir → uns, ihr → euch, sie/Sie → sich.',
  'sich freuen, sich waschen, sich beeilen, sich setzen, sich erinnern an …',
  'einander = друг друга (Sie helfen einander).'],
 [mc('Ich freue ___ auf das Wochenende.', 'mich', ['dich', 'sich', 'mir'], 'ich → mich.'),
  mc('Du musst ___ beeilen.', 'dich', ['mich', 'sich', 'dir'], 'du → dich.'),
  mc('Er wäscht ___ die Hände.', 'sich', ['ihn', 'mich', 'ihm'], 'er → sich (здесь Dativ тоже sich).'),
  mc('Wir treffen ___ um drei. (друг друга)', 'uns', ['euch', 'sich', 'wir'], 'wir → uns.'),
  mc('Setzt ___ bitte! (ihr)', 'euch', ['uns', 'sich', 'dich'], 'ihr → euch.'),
  mc('Die Kinder streiten ___.', 'sich', ['uns', 'euch', 'sie'], 'sie → sich.')])

topic('verbprep', 'Verben mit Präpositionen', 'KB S.106; AB S.120–122',
 ['warten auf + Akk., sich freuen auf + Akk. (будущее) / über + Akk. (настоящее), sich interessieren für + Akk.,',
  'denken an + Akk., sich erinnern an + Akk., teilnehmen an + Dat., sprechen über + Akk., träumen von + Dat.',
  'Вопрос: worauf? woran? worüber? — wo(r)- + предлог; о человеке: auf wen? an wen?'],
 [mc('Ich warte ___ den Bus.', 'auf', ['an', 'für', 'über'], 'warten auf + Akk.'),
  mc('Sie interessiert sich ___ Musik.', 'für', ['auf', 'an', 'von'], 'sich interessieren für.'),
  mc('Wir sprechen ___ das Wetter.', 'über', ['von', 'auf', 'an'], 'sprechen über + Akk.'),
  mc('Er träumt ___ einem Haus am Meer.', 'von', ['über', 'an', 'für'], 'träumen von + Dativ.'),
  mc('___ freust du dich? (Antwort: Auf die Ferien.)', 'Worauf', ['Wofür', 'Woran', 'Wovon'], 'sich freuen auf → worauf?'),
  mc('Ich denke oft ___ meine Familie.', 'an', ['auf', 'über', 'von'], 'denken an + Akk.'),
  mc('Ich ärgere mich ___ den Lärm.', 'über', ['auf', 'an', 'für'], 'sich ärgern über + Akk.')])

topic('genitiv', 'Genitiv', 'KB S.108–109; AB S.123–128',
 ['Artikel: m./n. des (+ -s/-es у существительного), f. der, мн.ч. der. Auto des Vaters, Tasche der Mutter.',
  'Генитив стоит после определяемого слова: das Haus meines Bruders.',
  'Имена: Annas Buch, Peters Auto (без артикля, -s). Разговорная замена: von + Dativ.'],
 [mc('Das ist das Auto ___ Vaters.', 'des', ['der', 'dem', 'den'], 'der Vater → Genitiv m.: des Vaters.'),
  mc('Die Tasche ___ Frau ist rot.', 'der', ['des', 'die', 'dem'], 'die Frau → Genitiv f.: der Frau.'),
  mc('Die Farbe ___ Hauses ist weiß.', 'des', ['der', 'dem', 'das'], 'das Haus → des Hauses.'),
  mc('Das sind die Spielzeuge ___ Kinder.', 'der', ['des', 'den', 'die'], 'Plural → der.'),
  mc('Das ist ___ Buch. (Anna)', 'Annas', ['Anna', 'von Annas', 'Annes'], 'Имя + -s без артикля.'),
  mc('die Einführung ___ Schuluniform', 'der', ['des', 'die', 'dem'], 'die Schuluniform → Genitiv f.: der.')])

topic('genprep', 'Präpositionen mit Genitiv', 'AB Kap.28; B-Grammatik S.162',
 ['wegen, trotz, während, statt/anstatt, innerhalb, außerhalb + Genitiv.',
  'wegen des Wetters, trotz des Regens, während der Ferien, statt des Autos.',
  'В разговорной речи часто + Dativ (wegen dem Wetter) — на письме лучше Genitiv.'],
 [mc('___ des Regens bleiben wir zu Hause.', 'Wegen', ['Bei', 'Für', 'Nach'], 'wegen + Genitiv (причина).'),
  mc('___ der schlechten Noten ist er glücklich.', 'Trotz', ['Wegen', 'Statt', 'Mit'], 'trotz — несмотря на.'),
  mc('Er arbeitet ___ der Ferien.', 'während', ['wegen', 'statt', 'trotz'], 'während — во время.'),
  mc('___ des Busses fahren wir mit dem Rad.', 'Statt', ['Während', 'Wegen', 'Trotz'], 'statt — вместо.'),
  mc('wegen ___ Krankheit', 'der', ['des', 'die', 'dem'], 'die Krankheit → Genitiv f.: der.'),
  mc('trotz ___ Wetters', 'des', ['der', 'dem', 'das'], 'das Wetter → des Wetters.')])

topic('tempprep', 'Temporale Präpositionen', 'KB S.108–109; 2026-11-04',
 ['um + время (um 8 Uhr); am + день/часть дня (am Montag, am Abend); im + месяц/сезон (im Mai).',
  'ab — с какого момента, bis — до какого, zwischen … und …, seit + Dat. (с … по сегодня), vor + Dat. (назад), nach + Dat.',
  'Вопросы: Wann? Ab wann? Bis wann? Wie lange?'],
 [mc('Der Kurs beginnt ___ 18 Uhr.', 'um', ['am', 'im', 'in'], 'um + время.'),
  mc('Wir treffen uns ___ Montag.', 'am', ['um', 'im', 'in'], 'am + день недели.'),
  mc('Er hat ___ Juli Urlaub.', 'im', ['am', 'um', 'zu'], 'im + месяц.'),
  mc('Ich bin ___ 19 Uhr zu Hause. (с)', 'ab', ['bis', 'um', 'seit'], 'ab — с какого времени.'),
  mc('Das Geschäft ist ___ 20 Uhr geöffnet. (до)', 'bis', ['ab', 'seit', 'um'], 'bis — до.'),
  mc('Sie wohnt ___ drei Jahren hier.', 'seit', ['vor', 'ab', 'für'], 'seit + Dativ — уже три года.'),
  mc('___ 18 und 19:30 Uhr haben wir Unterricht.', 'Zwischen', ['Ab', 'Bis', 'Um'], 'zwischen … und …')])

topic('praeteritum', 'Präteritum', 'KB S.129–131; AB Kap.26, 28',
 ['Слабые: корень + -te: machen → machte, du machtest, wir machten.',
  'Сильные: меняют гласную: gehen → ging, kommen → kam, sehen → sah, schreiben → schrieb.',
  'Смешанные: меняют гласную + -te: denken → dachte, bringen → brachte, wissen → wusste, kennen → kannte.',
  'sein: war, hatte: hatte, werden: wurde. Используется в письменной речи и рассказах.'],
 [mc('Gestern ___ ich im Kino. (sein)', 'war', ['bin', 'wäre', 'wurde'], 'sein → war.'),
  mc('Er ___ nach Hause. (gehen)', 'ging', ['gehte', 'gegangen', 'gang'], 'gehen — сильный: ging.'),
  mc('Wir ___ den Film. (sehen)', 'sahen', ['sehten', 'sahn', 'gesehen'], 'sehen → sah, sahen.'),
  mc('Sie ___ einen Brief. (schreiben)', 'schrieb', ['schreibte', 'schrieben', 'geschrieben'], 'schreiben → schrieb.'),
  mc('Ich ___ an dich. (denken)', 'dachte', ['denkte', 'dachtete', 'gedacht'], 'смешанный: denken → dachte.'),
  mc('Er ___ die Antwort nicht. (wissen)', 'wusste', ['wisste', 'weiß', 'wüsste'], 'wissen → wusste.'),
  mc('Sie ___ im Garten. (spielen)', 'spielte', ['spielt', 'spiel', 'spielten'], 'слабый: spielen → spielte.')])

topic('als_wenn', 'Nebensätze: als / wenn / während / obwohl', 'KB S.134–135; AB Kap.27',
 ['als — один раз в прошлом (Als ich 10 war, …). wenn — повторяется или настоящее/будущее (Immer wenn …).',
  'während — пока, одновременно. obwohl — хотя (уступка). wann — вопрос «когда?».',
  'Во всех придаточных спрягаемый глагол в конце.'],
 [mc('___ ich ein Kind war, wohnte ich in Moskau.', 'Als', ['Wenn', 'Wann', 'Obwohl'], 'Один раз в прошлом → als.'),
  mc('___ ich Zeit habe, lese ich.', 'Wenn', ['Als', 'Wann', 'Während'], 'Повторяется → wenn.'),
  mc('Er schläft, ___ es laut ist.', 'obwohl', ['weil', 'wenn', 'als'], 'obwohl — хотя.'),
  mc('___ kommst du zurück? (Frage)', 'Wann', ['Wenn', 'Als', 'Obwohl'], 'Вопрос «когда» — wann.'),
  mc('___ ich koche, hört sie Musik.', 'Während', ['Obwohl', 'Wann', 'Als wenn'], 'während — пока.'),
  od('Als ich klein war, wohnte ich auf dem Land.', 'После als-Nebensatz — глагол сразу (инверсия).'),
  od('Er bleibt zu Hause, obwohl er gesund ist.')])

topic('perfekt', 'Perfekt', 'ÜB S.4–6, S.37',
 ['haben / sein (на 2-м месте) + Partizip II (в конце). Ich habe gespielt. Er ist gefahren.',
  'sein — глаголы движения и изменения состояния: gehen, fahren, kommen, fliegen, aufstehen, werden, bleiben, sein.',
  'Слабые: ge-…-t (gemacht); сильные: ge-…-en (gesehen, gegangen); trennbare: aufgestanden; без ge-: besucht, verstanden, telefoniert.'],
 [mc('Ich ___ gestern Fußball gespielt.', 'habe', ['bin', 'hat', 'habt'], 'spielen → haben.'),
  mc('Er ___ nach Berlin gefahren.', 'ist', ['hat', 'wird', 'war'], 'fahren (движение) → sein.'),
  mc('Wir sind früh ___. (aufstehen)', 'aufgestanden', ['gestanden auf', 'aufgestehen', 'geaufstanden'], 'trennbar: auf + ge + stand + en.'),
  mc('Sie hat die Stadt ___. (besuchen)', 'besucht', ['gebesucht', 'besuchen', 'besuchte'], 'Приставка be- → без ge-.'),
  mc('Ich habe das Buch ___. (lesen)', 'gelesen', ['gelest', 'lesen', 'gelesst'], 'lesen — сильный: gelesen.'),
  mc('Haben Sie schon einmal Sushi ___?', 'gegessen', ['geessen', 'gegesst', 'gegessen hat'], 'essen → gegessen.'),
  od('Ich habe gestern einen Film gesehen.', 'Partizip II — в конце.'),
  od('Wir sind nach Hause gegangen.')])

topic('wechselprep', 'Wechselpräpositionen', 'KB S.12–13',
 ['an, auf, hinter, in, neben, über, unter, vor, zwischen: Wo? → Dativ; Wohin? → Akkusativ.',
  'Wo? — Das Buch liegt auf dem Tisch. Wohin? — Ich lege das Buch auf den Tisch.',
  'Положение: liegen, stehen, hängen, sitzen (Dativ); направление: legen, stellen, hängen, setzen (Akkusativ).'],
 [mc('Das Bild hängt an ___ Wand.', 'der', ['die', 'den', 'dem'], 'Wo? → Dativ, die Wand → der.'),
  mc('Ich hänge das Bild an ___ Wand.', 'die', ['der', 'dem', 'den'], 'Wohin? → Akkusativ: die.'),
  mc('Er stellt die Flasche auf ___ Tisch.', 'den', ['dem', 'der', 'die'], 'Wohin? → Akk. m.: den.'),
  mc('Die Flasche steht auf ___ Tisch.', 'dem', ['den', 'der', 'die'], 'Wo? → Dativ m.: dem.'),
  mc('Wir gehen in ___ Kino.', 'das', ['dem', 'den', 'der'], 'Wohin? → Akk. n.: das.'),
  mc('Sie wohnt in ___ Stadt.', 'der', ['die', 'dem', 'den'], 'Wo? → Dativ f.: der.')])

topic('konj', 'Hauptsatz: und / aber / oder / deshalb', 'ÜB S.4–13',
 ['und, aber, oder, denn, sondern — позиция 0: порядок слов не меняется (Subjekt – Verb).',
  'deshalb, deswegen, darum, trotzdem — стоят на 1-м месте, поэтому глагол следует за ними (Verb на 2-м месте!): Deshalb mag ich die Stadt.'],
 [od('Das ist schön, deshalb mag ich die Stadt.', 'После deshalb — глагол на 2-м месте.'),
  od('Ich bin müde, aber ich arbeite weiter.'),
  mc('Es regnet, ___ bleiben wir zu Hause.', 'deshalb', ['weil', 'dass', 'obwohl'], 'deshalb — поэтому (глагол на 2-м месте).'),
  mc('Ich mag Tee, ___ ich trinke keinen Kaffee.', 'aber', ['weil', 'dass', 'deshalb'], 'aber — но (позиция 0).'),
  od('Deshalb bleiben wir zu Hause.', 'После deshalb — сначала глагол.')])

topic('relativ', 'Relativsatz', 'KB Kap.2; ÜB Kap.14–16',
 ['Род и число — как у слова, на которое ссылаемся; падеж — по роли в придаточном.',
  'm.: der / den; f.: die / die; n.: das / das; Plural: die / die (Nom. / Akk.).',
  'Глагол стоит в конце: Das ist der Mann, der hier wohnt. Das ist der Film, den ich gesehen habe.'],
 [mc('Das ist der Mann, ___ hier wohnt.', 'der', ['den', 'die', 'dem'], 'Mann (m.), подлежащее → Nom.: der.'),
  mc('Das ist der Film, ___ ich gesehen habe.', 'den', ['der', 'das', 'dem'], 'Film (m.), дополнение → Akk.: den.'),
  mc('Die Frau, ___ dort steht, ist meine Lehrerin.', 'die', ['der', 'den', 'das'], 'Frau (f.), Nom. → die.'),
  mc('Das Kind, ___ spielt, ist mein Neffe.', 'das', ['der', 'die', 'den'], 'Kind (n.), Nom. → das.'),
  mc('Ich suche einen Baumarkt, ___ lange geöffnet ist.', 'der', ['den', 'das', 'die'], 'Baumarkt (m.), Nom. → der.'),
  od('Das ist das Haus, das ich kaufen möchte.', 'Глагол в конце придаточного.')])


import random
topic('wortbildung', 'Wortbildung: Nomen auf -heit, -keit, -ung', 'KB S.67; ÜB S.78 (2026-11-20)',
 ['Суффиксы -heit, -keit, -ung образуют существительные; они ВСЕГДА женского рода: die.',
  '-heit / -keit: от прилагательных (krank → die Krankheit, süß → die Süßigkeit, gesund → die Gesundheit).',
  '-ung: от глаголов (einladen → die Einladung, wohnen → die Wohnung). Мн. ч.: -en (die Einladungen).'],
 [mc('Какой артикль? ___ Krankheit', 'die', ['der', 'das', 'den'], 'Слова на -heit всегда die.'),
  mc('Какой артикль? ___ Wohnung', 'die', ['der', 'das', 'dem'], 'Слова на -ung всегда die.'),
  mc('einladen → ___ Einladung', 'die', ['der', 'das', 'ein'], 'Существительное на -ung — женского рода.'),
  mc('süß → die ___', 'Süßigkeit', ['Süßheit', 'Süßung', 'Süßen'], 'süß → Süßigkeit (вставляется -ig-: süß + igkeit).'),
  mc('gesund → die ___', 'Gesundheit', ['Gesundkeit', 'Gesundung', 'Gesunde'], 'gesund → -heit.'),
  mc('hoffen → die ___', 'Hoffnung', ['Hoffheit', 'Hoffkeit', 'Hoffen'], 'hoffen → Hoffnung (-ung).'),
  mc('bestellen → die ___', 'Bestellung', ['Bestellheit', 'Bestellkeit', 'Bestellt'], 'глагол + -ung.'),
  mc('Kind → die ___', 'Kindheit', ['Kindung', 'Kindkeit', 'Kinden'], 'Kind → Kindheit (детство).')])

R = random.Random(7)
def T_(id): return next(t for t in T if t['id'] == id)
def add(id, items):
    t = T_(id); seen = {(i.get('q') or i.get('s')) for i in t['items']}
    for i in items:
        k = i.get('q') or i.get('s')
        if k not in seen: seen.add(k); t['items'].append(i)
def pick3(correct, pool):
    pool = [x for x in dict.fromkeys(pool) if x != correct]
    R.shuffle(pool); return pool[:3]
PERS = ['ich', 'du', 'er', 'wir', 'ihr', 'sie (они)']
PCAP = ['Ich', 'Du', 'Er', 'Wir', 'Ihr', 'Sie (они)']
def plur(fr): return fr.replace('Das ist', 'Das sind').replace('Hier ist', 'Hier sind').replace('Dort liegt', 'Dort liegen')

# ---- Adjektivdeklination
nouns = {'m': ['Tisch', 'Mann', 'Hund', 'Garten', 'Schrank', 'Rock', 'Mantel', 'Pullover'],
         'f': ['Jacke', 'Frau', 'Stadt', 'Lampe', 'Tasche', 'Hose', 'Wohnung', 'Straße'],
         'n': ['Auto', 'Haus', 'Kind', 'Hemd', 'Buch', 'Kleid', 'Fahrrad', 'Zimmer'],
         'p': ['Schuhe', 'Bücher', 'Kinder', 'Hosen', 'Freunde', 'Taschen']}
adjs = ['neu', 'alt', 'groß', 'klein', 'schön', 'billig', 'rot', 'grün', 'warm', 'kalt', 'lang', 'kurz', 'bequem', 'nett', 'modern', 'schwarz']
DEF = {'m': 'der', 'f': 'die', 'n': 'das', 'p': 'die'}
DEFA = {'m': 'den', 'f': 'die', 'n': 'das', 'p': 'die'}
DEFD = {'m': 'dem', 'f': 'der', 'n': 'dem', 'p': 'den'}
INDEF = {'m': 'ein', 'f': 'eine', 'n': 'ein', 'p': 'meine'}
INDEFA = {'m': 'einen', 'f': 'eine', 'n': 'ein', 'p': 'meine'}
INDEFD = {'m': 'einem', 'f': 'einer', 'n': 'einem', 'p': 'meinen'}
def end(kind, case, g):
    if case == 'd': return 'en'
    if kind == 'def':
        if case == 'n': return 'en' if g == 'p' else 'e'
        return 'en' if g in 'mp' else 'e'
    if case == 'n': return {'m': 'er', 'f': 'e', 'n': 'es', 'p': 'en'}[g]
    return {'m': 'en', 'f': 'e', 'n': 'es', 'p': 'en'}[g]
CN = {'n': 'Nom.', 'a': 'Akk.', 'd': 'Dat.'}; GN_ = {'m': 'm.', 'f': 'f.', 'n': 'n.', 'p': 'мн.ч.'}
frames = {'n': ['Hier ist {art} {adj} {noun}.', 'Dort liegt {art} {adj} {noun}.'] , 'a': ['Ich kaufe {art} {adj} {noun}.', 'Sie sucht {art} {adj} {noun}.', 'Er mag {art} {adj} {noun}.'], 'd': ['Ich spreche mit {art} {adj} {noun}.', 'Wir wohnen bei {art} {adj} {noun}.', 'Er kommt mit {art} {adj} {noun}.']}
ad = []
for kind in ['def', 'indef']:
    for case in 'nad':
        for g in 'mfnp':
            art = (DEF if case == 'n' else DEFA if case == 'a' else DEFD)[g] if kind == 'def' else (INDEF if case == 'n' else INDEFA if case == 'a' else INDEFD)[g]
            if case == 'n' and kind == 'def' and g == 'p': art = 'die'
            e = end(kind, case, g)
            for _ in range(5):
                adj = R.choice(adjs); noun = R.choice(nouns[g]); fr = R.choice(frames[case])
                if g in 'mfn' and case == 'd' and fr.startswith('Wir wohnen bei') and g == 'n': fr = 'Ich spreche mit {art} {adj} {noun}.'
                if g == 'p' and case == 'n': fr = plur(fr)
                q = fr.format(art=art, adj='___', noun=noun)
                a = adj + e; w = [adj + x for x in ['e', 'en', 'er', 'es'] if x != e]
                expl = f"{art} ({CN[case]} {GN_[g]}) → окончание -{e}: {a}"
                ad.append(mc(q, a, w, expl))
R.shuffle(ad); add('adjdekl', ad)

# ---- Possessivpronomen
own = [('ich', 'mein', 'ich'), ('du', 'dein', 'du'), ('er', 'sein', 'er'), ('sie (она)', 'ihr', 'sie, она'), ('wir', 'unser', 'wir'), ('ihr', 'euer', 'ihr'), ('sie (они)', 'ihr', 'sie, они')]
pn = {'m': ['Bruder', 'Vater', 'Freund', 'Hund', 'Onkel', 'Lehrer'], 'f': ['Mutter', 'Schwester', 'Freundin', 'Katze', 'Tante', 'Lehrerin'], 'n': ['Kind', 'Baby', 'Pferd'], 'p': ['Eltern', 'Freunde', 'Kinder', 'Geschwister']}
PDAT = {'Freunde': 'Freunden', 'Kinder': 'Kindern'}   # Dativ Plural: -n
PE = {'n': {'m': '', 'f': 'e', 'n': '', 'p': 'e'}, 'a': {'m': 'en', 'f': 'e', 'n': '', 'p': 'e'}, 'd': {'m': 'em', 'f': 'er', 'n': 'em', 'p': 'en'}}
def poss(stem, e):
    if stem == 'euer' and e and e[0] in 'e': return 'eur' + e
    return stem + e
pf = {'n': ['Das ist ___ {n}.', 'Hier ist ___ {n}.'], 'a': ['Ich besuche ___ {n}.', 'Ich kenne ___ {n}.', 'Siehst du ___ {n}?'], 'd': ['Ich telefoniere mit ___ {n}.', 'Ich helfe ___ {n}.', 'Er spricht mit ___ {n}.']}
pl = []
for case in 'nad':
    for g in 'mfnp':
        for _ in range(6):
            o = R.choice(own); n_ = R.choice(pn[g]); e = PE[case][g]
            a = poss(o[1], e)
            if case == 'a' and g == 'p' and False: pass
            wr = pick3(a, [poss(o[1], x) for x in ['', 'e', 'en', 'em', 'er']])
            fq = R.choice(pf[case]); fq = plur(fq) if g == 'p' and case == 'n' else fq
            if case == 'd' and g == 'p': n_ = PDAT.get(n_, n_)
            q = fq.format(n=n_) + f' ({o[2]})'
            q = q.replace('. (', ' (', 1) if q.endswith(').') else q
            pl.append(mc(q, a, wr, f"{o[0]} → {o[1]}-; {CN[case]} {GN_[g]} → {('-' + e) if e else 'без окончания'}: {a}."))
R.shuffle(pl); add('possessiv', pl)

# ---- Genitiv
gn = [('der', 'Vater', 'des', 'Vaters'), ('der', 'Lehrer', 'des', 'Lehrers'), ('der', 'Hund', 'des', 'Hundes'), ('der', 'Tisch', 'des', 'Tisches'), ('der', 'Bruder', 'des', 'Bruders'), ('der', 'Garten', 'des', 'Gartens'),
      ('die', 'Mutter', 'der', 'Mutter'), ('die', 'Lehrerin', 'der', 'Lehrerin'), ('die', 'Stadt', 'der', 'Stadt'), ('die', 'Schule', 'der', 'Schule'), ('die', 'Freundin', 'der', 'Freundin'),
      ('das', 'Haus', 'des', 'Hauses'), ('das', 'Kind', 'des', 'Kindes'), ('das', 'Auto', 'des', 'Autos'), ('das', 'Buch', 'des', 'Buches'), ('das', 'Zimmer', 'des', 'Zimmers'),
      ('die', 'Kinder', 'der', 'Kinder'), ('die', 'Eltern', 'der', 'Eltern'), ('die', 'Lehrer', 'der', 'Lehrer')]
owned = ['das Auto', 'das Fahrrad', 'das Haus', 'die Tasche', 'das Handy', 'das Zimmer', 'die Farbe', 'der Name', 'die Meinung', 'die Arbeit']
gl = []
for art, n_, ga, gf in gn:
    for _ in range(2):
        o = R.choice(owned)
        gl.append(mc(f'Das ist {o} ___ {gf}.', ga, pick3(ga, ['der', 'des', 'dem', 'den', 'die']), f'{art} {n_} → Genitiv: {ga} {gf}.'))
    if ga == 'des' and gf != n_:
        o = R.choice(owned)
        gl.append(mc(f'Das ist {o} des ___. ({n_})', gf, pick3(gf, [n_, n_ + 'n', n_ + 'e', n_ + 'en']), f'Генитив м./ср. рода: {ga} {gf} (окончание -s/-es).'))
R.shuffle(gl); add('genitiv', gl)

# ---- Wechselpräpositionen
def art_for(case, g): return {'d': {'m': 'dem', 'f': 'der', 'n': 'dem', 'p': 'den'}, 'a': {'m': 'den', 'f': 'die', 'n': 'das', 'p': 'die'}}[case][g]
wf = [('Das Buch liegt auf ___ Tisch.', 'd', 'm'), ('Ich lege das Buch auf ___ Tisch.', 'a', 'm'), ('Die Lampe hängt an ___ Decke.', 'd', 'f'), ('Ich hänge die Lampe an ___ Decke.', 'a', 'f'),
      ('Das Kind sitzt auf ___ Sofa.', 'd', 'n'), ('Ich setze das Kind auf ___ Sofa.', 'a', 'n'), ('Die Flasche steht in ___ Kühlschrank.', 'd', 'm'), ('Ich stelle die Flasche in ___ Kühlschrank.', 'a', 'm'),
      ('Er wohnt in ___ Stadt.', 'd', 'f'), ('Er fährt in ___ Stadt.', 'a', 'f'), ('Wir sind in ___ Kino.', 'd', 'n'), ('Wir gehen in ___ Kino.', 'a', 'n'),
      ('Der Hund liegt unter ___ Tisch.', 'd', 'm'), ('Der Hund läuft unter ___ Tisch.', 'a', 'm'), ('Das Auto steht vor ___ Haus.', 'd', 'n'), ('Er stellt das Auto vor ___ Haus.', 'a', 'n'),
      ('Das Bild hängt über ___ Bett.', 'd', 'n'), ('Sie hängt das Bild über ___ Bett.', 'a', 'n'), ('Die Katze sitzt hinter ___ Schrank.', 'd', 'm'), ('Die Katze springt hinter ___ Schrank.', 'a', 'm'),
      ('Der Stuhl steht neben ___ Tür.', 'd', 'f'), ('Ich stelle den Stuhl neben ___ Tür.', 'a', 'f'), ('Das Geld liegt in ___ Tasche.', 'd', 'f'), ('Ich stecke das Geld in ___ Tasche.', 'a', 'f'),
      ('Wir treffen uns an ___ Bahnhof.', 'd', 'm'), ('Wir fahren an ___ Bahnhof.', 'a', 'm'), ('Die Kinder spielen auf ___ Straße.', 'd', 'f'), ('Die Kinder laufen auf ___ Straße.', 'a', 'f'),
      ('Er steht zwischen ___ Haus und der Schule.', 'd', 'n'), ('Sie stellt sich zwischen ___ Kinder.', 'a', 'p'), ('Der Schlüssel liegt auf ___ Regalen.', 'd', 'p'), ('Er stellt die Bücher auf ___ Regale.', 'a', 'p')]
wl = [mc(q, art_for(c, g), pick3(art_for(c, g), ['der', 'die', 'das', 'dem', 'den']), ('Wo? → Dativ' if c == 'd' else 'Wohin? → Akkusativ') + f' ({GN_[g]}): {art_for(c, g)}.') for q, c, g in wf]
add('wechselprep', wl)

# ---- Präsens
pv = [('fahren', ['fahre', 'fährst', 'fährt', 'fahren', 'fahrt', 'fahren'], 'nach Hause'), ('schlafen', ['schlafe', 'schläfst', 'schläft', 'schlafen', 'schlaft', 'schlafen'], 'lange'),
      ('sprechen', ['spreche', 'sprichst', 'spricht', 'sprechen', 'sprecht', 'sprechen'], 'Deutsch'), ('lesen', ['lese', 'liest', 'liest', 'lesen', 'lest', 'lesen'], 'ein Buch'),
      ('sehen', ['sehe', 'siehst', 'sieht', 'sehen', 'seht', 'sehen'], 'einen Film'), ('essen', ['esse', 'isst', 'isst', 'essen', 'esst', 'essen'], 'Pizza'),
      ('nehmen', ['nehme', 'nimmst', 'nimmt', 'nehmen', 'nehmt', 'nehmen'], 'den Bus'), ('geben', ['gebe', 'gibst', 'gibt', 'geben', 'gebt', 'geben'], 'mir das Buch'),
      ('laufen', ['laufe', 'läufst', 'läuft', 'laufen', 'lauft', 'laufen'], 'schnell'), ('helfen', ['helfe', 'hilfst', 'hilft', 'helfen', 'helft', 'helfen'], 'mir'),
      ('treffen', ['treffe', 'triffst', 'trifft', 'treffen', 'trefft', 'treffen'], 'Freunde'), ('arbeiten', ['arbeite', 'arbeitest', 'arbeitet', 'arbeiten', 'arbeitet', 'arbeiten'], 'viel'),
      ('wohnen', ['wohne', 'wohnst', 'wohnt', 'wohnen', 'wohnt', 'wohnen'], 'in Berlin'), ('sein', ['bin', 'bist', 'ist', 'sind', 'seid', 'sind'], 'müde'), ('haben', ['habe', 'hast', 'hat', 'haben', 'habt', 'haben'], 'Hunger'),
      ('wissen', ['weiß', 'weißt', 'weiß', 'wissen', 'wisst', 'wissen'], 'die Antwort')]
pr = []
for inf, f, tail in pv:
    for i in R.sample(range(6), 4):
        pr.append(mc(f'{PCAP[i]} ___ {tail}. ({inf})', f[i], pick3(f[i], f), f'{PERS[i]} → {f[i]}.'))
R.shuffle(pr); add('praesens', pr)

# ---- Präteritum
pt = [('sein', 'war', 'waren', 'müde'), ('haben', 'hatte', 'hatten', 'Hunger'), ('gehen', 'ging', 'gingen', 'nach Hause'), ('kommen', 'kam', 'kamen', 'spät'), ('sehen', 'sah', 'sahen', 'einen Film'),
      ('schreiben', 'schrieb', 'schrieben', 'einen Brief'), ('spielen', 'spielte', 'spielten', 'Fußball'), ('machen', 'machte', 'machten', 'Hausaufgaben'), ('wohnen', 'wohnte', 'wohnten', 'in Berlin'),
      ('denken', 'dachte', 'dachten', 'an dich'), ('bringen', 'brachte', 'brachten', 'Blumen'), ('wissen', 'wusste', 'wussten', 'die Antwort nicht'), ('kennen', 'kannte', 'kannten', 'ihn nicht'),
      ('fahren', 'fuhr', 'fuhren', 'nach Wien'), ('finden', 'fand', 'fanden', 'den Schlüssel'), ('nehmen', 'nahm', 'nahmen', 'den Bus'), ('sprechen', 'sprach', 'sprachen', 'mit Anna'),
      ('lesen', 'las', 'lasen', 'ein Buch'), ('bleiben', 'blieb', 'blieben', 'zu Hause'), ('arbeiten', 'arbeitete', 'arbeiteten', 'viel')]
pl2 = []
for inf, a, b, tail in pt:
    stem = inf[:-2] if inf.endswith('en') else inf
    for subj, form, other in [('ich', a, b), ('er', a, b), ('wir', b, a), ('sie (они)', b, a)]:
        wrong = [stem + 'te', other, R.choice(pt)[1]]
        if stem + 'te' == form: wrong[0] = inf
        sj = subj.split(' ')[0].capitalize()
        pl2.append(mc(f'Gestern ___ {subj} {tail}. ({inf})', form, pick3(form, wrong + [R.choice(pt)[2]]), f'{inf} → Präteritum: {a} / {b} (wir, sie).'))
R.shuffle(pl2); add('praeteritum', pl2[:60])

# ---- Modalverben Präteritum
md = [('können', 'konnte', ['kann', 'kannst', 'kann', 'können', 'könnt', 'können'], 'kommen'), ('müssen', 'musste', ['muss', 'musst', 'muss', 'müssen', 'müsst', 'müssen'], 'arbeiten'),
      ('wollen', 'wollte', ['will', 'willst', 'will', 'wollen', 'wollt', 'wollen'], 'gehen'), ('sollen', 'sollte', ['soll', 'sollst', 'soll', 'sollen', 'sollt', 'sollen'], 'warten'),
      ('dürfen', 'durfte', ['darf', 'darfst', 'darf', 'dürfen', 'dürft', 'dürfen'], 'bleiben')]
ENDS = ['', 'st', '', 'n', 't', 'n']
ml = []
for inf, st, pres, vb in md:
    for i in range(6):
        a = st + ENDS[i]
        um = a.replace('o', 'ö').replace('u', 'ü', 1) if inf in ('können', 'müssen', 'dürfen') else a + 'e'
        wr = [pres[i], um if um != a else a + 'e', st + ENDS[(i + 3) % 6]]
        ml.append(mc(f'Gestern ___ {PERS[i]} nicht {vb}. ({inf})', a, pick3(a, wr + [pres[(i + 1) % 6]]), f'{inf} → {st}-; {PERS[i]} → {a}.'))
R.shuffle(ml); add('modal_prat', ml)

# ---- Perfekt
pf_ = [('spielen', 'gespielt', 'h', 'Fußball'), ('machen', 'gemacht', 'h', 'Hausaufgaben'), ('kaufen', 'gekauft', 'h', 'Brot'), ('lernen', 'gelernt', 'h', 'Deutsch'), ('arbeiten', 'gearbeitet', 'h', 'viel'),
       ('sehen', 'gesehen', 'h', 'einen Film'), ('lesen', 'gelesen', 'h', 'ein Buch'), ('schreiben', 'geschrieben', 'h', 'einen Brief'), ('essen', 'gegessen', 'h', 'Pizza'), ('trinken', 'getrunken', 'h', 'Tee'),
       ('gehen', 'gegangen', 's', 'ins Kino'), ('fahren', 'gefahren', 's', 'nach Berlin'), ('kommen', 'gekommen', 's', 'pünktlich'), ('fliegen', 'geflogen', 's', 'nach Rom'), ('bleiben', 'geblieben', 's', 'zu Hause'),
       ('aufstehen', 'aufgestanden', 's', 'früh'), ('besuchen', 'besucht', 'h', 'die Oma'), ('verstehen', 'verstanden', 'h', 'alles'), ('telefonieren', 'telefoniert', 'h', 'lange'), ('einkaufen', 'eingekauft', 'h', 'im Supermarkt'),
       ('ankommen', 'angekommen', 's', 'spät'), ('laufen', 'gelaufen', 's', 'zur Schule'), ('schlafen', 'geschlafen', 'h', 'gut'), ('nehmen', 'genommen', 'h', 'den Bus'), ('finden', 'gefunden', 'h', 'den Schlüssel'),
       ('sprechen', 'gesprochen', 'h', 'mit ihm'), ('treffen', 'getroffen', 'h', 'Freunde')]
AUX = {'h': ['habe', 'hast', 'hat', 'haben', 'habt', 'haben'], 's': ['bin', 'bist', 'ist', 'sind', 'seid', 'sind']}
pfl = []
for inf, part, ax, tail in pf_:
    for i in R.sample(range(6), 2):
        a = AUX[ax][i]
        pfl.append(mc(f'{PCAP[i]} ___ gestern {tail} {part}.', a, pick3(a, AUX['h'] + AUX['s']), f'{inf}: {"haben" if ax=="h" else "sein (движение / изменение)"} → {a} {part}.'))
    others = [x[1] for x in pf_ if x[1] != part]
    pfl.append(mc(f'Ich habe gestern {tail} ___. ({inf})'.replace('habe', 'habe' if ax == 'h' else 'bin'), part, pick3(part, others), f'Partizip II: {part}.'))
R.shuffle(pfl); add('perfekt', pfl)

# ---- Reflexiv
rv = [(['freue', 'freust', 'freut', 'freuen', 'freut', 'freuen'], 'auf den Urlaub'), (['beeile', 'beeilst', 'beeilt', 'beeilen', 'beeilt', 'beeilen'], 'heute'), (['setze', 'setzt', 'setzt', 'setzen', 'setzt', 'setzen'], 'auf das Sofa'),
      (['wasche', 'wäschst', 'wäscht', 'waschen', 'wascht', 'waschen'], 'vor dem Essen'), (['interessiere', 'interessierst', 'interessiert', 'interessieren', 'interessiert', 'interessieren'], 'für Musik'),
      (['ärgere', 'ärgerst', 'ärgert', 'ärgern', 'ärgert', 'ärgern'], 'über den Lärm'), (['erinnere', 'erinnerst', 'erinnert', 'erinnern', 'erinnert', 'erinnern'], 'an den Urlaub')]
RP = ['mich', 'dich', 'sich', 'uns', 'euch', 'sich']
rl = []
for f, tail in rv:
    for i in range(6):
        rl.append(mc(f'{PCAP[i]} {f[i]} ___ {tail}.', RP[i], pick3(RP[i], RP + ['mir', 'dir']), f'{PERS[i]} → {RP[i]}.'))
R.shuffle(rl); add('reflexiv', rl)

# ---- Komparativ
ka = [('schnell', 'schneller', 'schnellsten'), ('alt', 'älter', 'ältesten'), ('groß', 'größer', 'größten'), ('jung', 'jünger', 'jüngsten'), ('klein', 'kleiner', 'kleinsten'), ('lang', 'länger', 'längsten'),
      ('kurz', 'kürzer', 'kürzesten'), ('warm', 'wärmer', 'wärmsten'), ('kalt', 'kälter', 'kältesten'), ('hoch', 'höher', 'höchsten'), ('gut', 'besser', 'besten'), ('teuer', 'teurer', 'teuersten'),
      ('dunkel', 'dunkler', 'dunkelsten'), ('billig', 'billiger', 'billigsten'), ('schön', 'schöner', 'schönsten'), ('stark', 'stärker', 'stärksten'), ('nett', 'netter', 'nettesten'), ('klug', 'klüger', 'klügsten')]
NM = ['Anna', 'Tom', 'Peter', 'Lena', 'Max', 'Julia']
kl = []
for pos, c, sp in ka:
    n1, n2 = R.sample(NM, 2)
    wr = [pos + 'er' if pos + 'er' != c else pos + 'ere', 'am ' + sp, pos + 'ere', sp]
    kl.append(mc(f'{n1} ist ___ als {n2}. ({pos})', c, pick3(c, wr), f'{pos} → {c} (Komparativ) + als.'))
    n1 = R.choice(NM)
    kl.append(mc(f'{n1} ist ___ von allen. ({pos})', 'am ' + sp, pick3('am ' + sp, [c, 'am ' + c, sp, 'am ' + pos + 'sten']), f'Superlativ: am {sp}.'))
    n1, n2 = R.sample(NM, 2)
    kl.append(mc(f'{n1} ist so ___ wie {n2}. ({pos})', pos, pick3(pos, [c, 'am ' + sp, pos + 'e']), 'so … wie + Positiv (без -er).'))
R.shuffle(kl); add('komparativ', kl)

# ---- Imperativ
im = [('kommen', 'Komm', 'Kommt', 'Kommen'), ('machen', 'Mach', 'Macht', 'Machen'), ('warten', 'Warte', 'Wartet', 'Warten'), ('lesen', 'Lies', 'Lest', 'Lesen'), ('nehmen', 'Nimm', 'Nehmt', 'Nehmen'),
      ('geben', 'Gib', 'Gebt', 'Geben'), ('fahren', 'Fahr', 'Fahrt', 'Fahren'), ('sprechen', 'Sprich', 'Sprecht', 'Sprechen'), ('helfen', 'Hilf', 'Helft', 'Helfen'), ('sehen', 'Sieh', 'Seht', 'Sehen'),
      ('essen', 'Iss', 'Esst', 'Essen'), ('schlafen', 'Schlaf', 'Schlaft', 'Schlafen'), ('sein', 'Sei', 'Seid', 'Seien'), ('arbeiten', 'Arbeite', 'Arbeitet', 'Arbeiten'), ('trinken', 'Trink', 'Trinkt', 'Trinken')]
il = []
for inf, d, i_, s_ in im:
    allf = [d, i_, s_, d + 'st', d + 'e', inf]
    il.append(mc(f'___ bitte! (du, {inf})', d, pick3(d, allf), f'du-Imperativ: {d}!'))
    il.append(mc(f'___ bitte! (ihr, {inf})', i_, pick3(i_, allf), f'ihr-Imperativ: {i_}!'))
    il.append(mc(f'___ Sie bitte! ({inf})', s_, pick3(s_, allf), f'Sie-Imperativ: {s_} Sie!'))
R.shuffle(il); add('imperativ', il)

# ---- Passiv
pa = [('Der Kuchen', 's', 'gebacken', 'backen'), ('Die Brötchen', 'p', 'gebacken', 'backen'), ('Die Kartoffeln', 'p', 'geschält', 'schälen'), ('Das Gemüse', 's', 'geschnitten', 'schneiden'), ('Die Suppe', 's', 'gekocht', 'kochen'),
      ('Das Fleisch', 's', 'gebraten', 'braten'), ('Die Eier', 'p', 'gekocht', 'kochen'), ('Der Tisch', 's', 'gedeckt', 'decken'), ('Die Tür', 's', 'geöffnet', 'öffnen'), ('Die Fenster', 'p', 'geputzt', 'putzen'),
      ('Das Auto', 's', 'repariert', 'reparieren'), ('Die Zimmer', 'p', 'gestrichen', 'streichen'), ('Der Salat', 's', 'gemacht', 'machen'), ('Die Äpfel', 'p', 'gewaschen', 'waschen')]
pal = []
for sj, n, part, inf in pa:
    a = 'wird' if n == 's' else 'werden'
    pal.append(mc(f'{sj} ___ {part}.', a, pick3(a, ['wird', 'werden', 'wirst', 'ist', 'sind']), f'Passiv: werden + Partizip II ({"ед." if n=="s" else "мн."} → {a}).'))
    pal.append(mc(f'{sj} {a} ___. ({inf})', part, pick3(part, [inf, 'ge' + inf, 'ge' + inf[:-2] + 'et', inf[:-2] + 't']), f'Partizip II: {part}.'))
add('passiv', pal)

# ---- Komposita
kp = [('Hand', 'die Tasche', 'Handtasche'), ('Kühl', 'der Schrank', 'Kühlschrank'), ('Wasch', 'die Maschine', 'Waschmaschine'), ('Schlaf', 'das Zimmer', 'Schlafzimmer'), ('Bad', 'das Zimmer', 'Badezimmer'),
      ('Küchen', 'der Tisch', 'Küchentisch'), ('Haus', 'die Tür', 'Haustür'), ('Fuß', 'der Ball', 'Fußball'), ('Tisch', 'die Lampe', 'Tischlampe'), ('Wasser', 'die Flasche', 'Wasserflasche'),
      ('Kaffee', 'die Tasse', 'Kaffeetasse'), ('Zahn', 'die Bürste', 'Zahnbürste'), ('Zahn', 'der Arzt', 'Zahnarzt'), ('Handy', 'die Nummer', 'Handynummer'), ('Computer', 'das Spiel', 'Computerspiel'),
      ('Kinder', 'das Zimmer', 'Kinderzimmer'), ('Garten', 'der Tisch', 'Gartentisch'), ('Geburtstags', 'der Kuchen', 'Geburtstagskuchen'), ('Hunde', 'das Futter', 'Hundefutter'), ('Fahrrad', 'der Helm', 'Fahrradhelm'),
      ('Schul', 'das Heft', 'Schulheft'), ('Sonnen', 'die Brille', 'Sonnenbrille'), ('Reise', 'das Büro', 'Reisebüro'), ('Bücher', 'das Regal', 'Bücherregal'), ('Winter', 'die Jacke', 'Winterjacke'), ('Sommer', 'der Urlaub', 'Sommerurlaub')]
kpl = []
for fi, (a, n2, res) in enumerate(kp):
    art = n2.split()[0]
    kpl.append(mc(f'Какой артикль у {res}? ({fi and ""}{a.lower() if False else a} + {n2.split()[1]})'.replace(' ()', ''), art, [x for x in ['der', 'die', 'das'] if x != art], f'Определяет последнее слово: {n2} → {art} {res}.'))
add('komposita', kpl)

# ---- Verben mit Präpositionen
vp = [('Ich warte ___ den Bus.', 'auf'), ('Sie interessiert sich ___ Musik.', 'für'), ('Wir sprechen ___ das Wetter.', 'über'), ('Er träumt ___ einem Haus.', 'von'), ('Ich denke oft ___ meine Familie.', 'an'),
      ('Ich ärgere mich ___ den Lärm.', 'über'), ('Sie freut sich ___ die Ferien. (будут)', 'auf'), ('Er freut sich ___ das Geschenk. (получил)', 'über'), ('Wir nehmen ___ dem Kurs teil.', 'an'),
      ('Ich erinnere mich ___ den Urlaub.', 'an'), ('Sie hat ___ ihrer Mutter gesprochen.', 'mit'), ('Er fragt ___ dem Weg.', 'nach'), ('Ich bedanke mich ___ die Hilfe.', 'für'), ('Wir gratulieren dir ___ Geburtstag.', 'zum'),
      ('Sie sucht ___ ihrem Schlüssel.', 'nach'), ('Ich rede ___ meinem Chef.', 'mit'), ('Er hört ___ der Arbeit auf.', 'mit'), ('Das Buch handelt ___ einem Detektiv.', 'von'), ('Ich bereite mich ___ die Prüfung vor.', 'auf'),
      ('Wir streiten uns ___ Geld.', 'um'), ('Es geht ___ Gesundheit.', 'um'), ('Ich lade dich ___ meiner Party ein.', 'zu')]
vpl = [mc(q, a, pick3(a, ['auf', 'an', 'für', 'über', 'von', 'mit', 'um', 'nach', 'zu']), f'Verb + {a}.') for q, a in vp if a != 'zum']
add('verbprep', vpl)

# ---- Temporale Präpositionen
tp = [('Der Film beginnt ___ 20 Uhr.', 'um'), ('Ich habe ___ Montag Unterricht.', 'am'), ('Wir fahren ___ Juli in den Urlaub.', 'im'), ('___ 18 Uhr bin ich zu Hause. (с)', 'Ab'),
      ('Das Café ist ___ 22 Uhr geöffnet. (до)', 'bis'), ('Er wohnt ___ zwei Jahren hier.', 'seit'), ('___ 12 und 13 Uhr ist Pause.', 'Zwischen'), ('Ich stehe ___ Morgen früh auf.', 'am'),
      ('Das war ___ drei Tagen. (назад)', 'vor'), ('___ dem Essen gehen wir spazieren.', 'Nach'), ('Im Winter ist es kalt. / Ich fahre ___ Sommer ans Meer.', 'im'), ('Wir treffen uns ___ Wochenende.', 'am'),
      ('Ich arbeite ___ Freitag. (до пятницы)', 'bis'), ('Sie lernt Deutsch ___ einem Jahr.', 'seit'), ('Der Kurs dauert ___ März ___ Juni.', 'von'), ('Ich rufe dich ___ Mittag an.', 'am'),
      ('Ich stehe ___ halb sieben auf.', 'um'), ('___ Frühling blühen die Blumen.', 'Im'), ('Ich war ___ einer Woche krank. (неделю назад)', 'vor'), ('Er ist ___ Weihnachten hier. (до)', 'bis')]
tpl = [mc(q, a, pick3(a, ['um', 'am', 'im', 'ab', 'bis', 'seit', 'vor', 'zwischen', 'nach', 'von'] if a[0].islower() else ['Um', 'Am', 'Im', 'Ab', 'Bis', 'Seit', 'Vor', 'Zwischen', 'Nach']), 'Предлог времени: ' + a + '.') for q, a in tp if '___ März ___' not in q and '/' not in q]
add('tempprep', tpl)

# ---- Starke / gemischte / schwache Verben: Präteritum + Perfekt (Stammformen)
# inf | Prät. 3.Sg | Partizip II | Hilfsverb | Partikel (trennbar) | pусский
SV = """beginnen|begann|begonnen|h||начинать
bleiben|blieb|geblieben|s||оставаться
bringen|brachte|gebracht|h||приносить
denken|dachte|gedacht|h||думать
essen|aß|gegessen|h||есть
fahren|fuhr|gefahren|s||ехать
fallen|fiel|gefallen|s||падать
finden|fand|gefunden|h||находить
fliegen|flog|geflogen|s||лететь
geben|gab|gegeben|h||давать
gehen|ging|gegangen|s||идти
gewinnen|gewann|gewonnen|h||выигрывать
halten|hielt|gehalten|h||держать
heißen|hieß|geheißen|h||называться
helfen|half|geholfen|h||помогать
kennen|kannte|gekannt|h||знать (кого-то)
kommen|kam|gekommen|s||приходить
laufen|lief|gelaufen|s||бежать
lesen|las|gelesen|h||читать
liegen|lag|gelegen|h||лежать
nehmen|nahm|genommen|h||брать
rufen|rief|gerufen|h||звать
schlafen|schlief|geschlafen|h||спать
schreiben|schrieb|geschrieben|h||писать
schwimmen|schwamm|geschwommen|s||плавать
sehen|sah|gesehen|h||видеть
sein|war|gewesen|s||быть
singen|sang|gesungen|h||петь
sitzen|saß|gesessen|h||сидеть
sprechen|sprach|gesprochen|h||говорить
stehen|stand|gestanden|h||стоять
sterben|starb|gestorben|s||умирать
tragen|trug|getragen|h||носить
treffen|traf|getroffen|h||встречать
trinken|trank|getrunken|h||пить
tun|tat|getan|h||делать
vergessen|vergaß|vergessen|h||забывать
verlieren|verlor|verloren|h||терять
verstehen|verstand|verstanden|h||понимать
waschen|wusch|gewaschen|h||мыть
werden|wurde|geworden|s||становиться
wissen|wusste|gewusst|h||знать
ziehen|zog|gezogen|h||тянуть
bekommen|bekam|bekommen|h||получать
gefallen|gefiel|gefallen|h||нравиться
schließen|schloss|geschlossen|h||закрывать
schneiden|schnitt|geschnitten|h||резать
bitten|bat|gebeten|h||просить
brechen|brach|gebrochen|h||ломать
empfehlen|empfahl|empfohlen|h||рекомендовать
entscheiden|entschied|entschieden|h||решать
fangen|fing|gefangen|h||ловить
greifen|griff|gegriffen|h||хватать
lügen|log|gelogen|h||лгать
scheinen|schien|geschienen|h||светить, казаться
springen|sprang|gesprungen|s||прыгать
steigen|stieg|gestiegen|s||подниматься
streiten|stritt|gestritten|h||спорить
verbringen|verbrachte|verbracht|h||проводить (время)
verschwinden|verschwand|verschwunden|s||исчезать
wachsen|wuchs|gewachsen|s||расти
werfen|warf|geworfen|h||бросать
nennen|nannte|genannt|h||называть
rennen|rannte|gerannt|s||бежать, мчаться
brennen|brannte|gebrannt|h||гореть
leihen|lieh|geliehen|h||одалживать
raten|riet|geraten|h||советовать
schlagen|schlug|geschlagen|h||бить
verlassen|verließ|verlassen|h||покидать
vergleichen|verglich|verglichen|h||сравнивать
beschreiben|beschrieb|beschrieben|h||описывать
erfahren|erfuhr|erfahren|h||узнавать
anrufen|rief|angerufen|h|an|звонить
aufstehen|stand|aufgestanden|s|auf|вставать
einladen|lud|eingeladen|h|ein|приглашать
mitbringen|brachte|mitgebracht|h|mit|приносить с собой
anfangen|fing|angefangen|h|an|начинать
ankommen|kam|angekommen|s|an|прибывать
aussehen|sah|ausgesehen|h|aus|выглядеть
abfahren|fuhr|abgefahren|s|ab|отъезжать
umziehen|zog|umgezogen|s|um|переезжать
einschlafen|schlief|eingeschlafen|s|ein|засыпать
teilnehmen|nahm|teilgenommen|h|teil|участвовать
fernsehen|sah|ferngesehen|h|fern|смотреть телевизор
aufmachen|machte|aufgemacht|h|auf|открывать
mitkommen|kam|mitgekommen|s|mit|идти вместе
zurückkommen|kam|zurückgekommen|s|zurück|возвращаться
machen|machte|gemacht|h||делать
lernen|lernte|gelernt|h||учить
spielen|spielte|gespielt|h||играть
arbeiten|arbeitete|gearbeitet|h||работать
kaufen|kaufte|gekauft|h||покупать
wohnen|wohnte|gewohnt|h||жить
besuchen|besuchte|besucht|h||посещать
kochen|kochte|gekocht|h||готовить
hören|hörte|gehört|h||слышать
sagen|sagte|gesagt|h||говорить
fragen|fragte|gefragt|h||спрашивать
warten|wartete|gewartet|h||ждать
telefonieren|telefonierte|telefoniert|h||звонить по телефону
studieren|studierte|studiert|h||учиться в вузе
reisen|reiste|gereist|s||путешествовать
passieren|passierte|passiert|s||случаться
erleben|erlebte|erlebt|h||переживать
einkaufen|kaufte|eingekauft|h|ein|делать покупки"""
VERBS = [l.split('|') for l in SV.strip().split('\n')]
STRONG_PL = [v for v in VERBS]
PRONS = [('ich', 0), ('er', 0), ('du', 1), ('wir', 2), ('sie (они)', 2)]
def pform(base, k):
    if k == 0: return base
    if k == 2: return base + ('n' if base.endswith('e') else 'en')
    if base.endswith(('s', 'ß', 'x', 'z', 't', 'd')): return base + 'est'
    return base + 'st'
AUX = {'h': {'ich': 'habe', 'er': 'hat', 'du': 'hast', 'wir': 'haben', 'sie (они)': 'haben'},
       's': {'ich': 'bin', 'er': 'ist', 'du': 'bist', 'wir': 'sind', 'sie (они)': 'sind'}}
def weak_part(inf, part, pre):
    stem = inf[len(part):] if part else inf
    stem = stem[:-2] if stem.endswith('en') else stem[:-1]
    return (part + 'ge' + stem + 't') if part else 'ge' + stem + 't'
rg = random.Random(11)
prl, pfl = [], []
for inf, pr, p2, aux, part, ru in VERBS:
    base_inf = inf
    for k in range(2):
        pn, kk = rg.choice(PRONS)
        form = pform(pr, kk)
        pool = [pform(pr, 2 if kk == 0 else 0), p2, (inf[len(part):] if part else inf)[:-2] + 'te', rg.choice(VERBS)[1], pform(rg.choice(VERBS)[1], kk)]
        pool = [x for x in dict.fromkeys(pool) if x != form]
        w = rg.sample(pool, min(3, len(pool)))
        q = f'Präteritum: {pn} ___{" " + part if part else ""} ({inf})'
        prl.append(mc(q, form, w, f'{inf} — {pr} — {p2} ({ru}). {pn} → {form}.'))
    for k in range(2):
        pn, kk = rg.choice(PRONS)
        a = AUX[aux][pn]; a2 = AUX['s' if aux == 'h' else 'h'][pn]
        right = f'{a} {p2}'
        wp = weak_part(inf, part, None)
        cand = [f'{a2} {p2}', f'{a} {wp}', f'{a2} {wp}', f'{a} {inf}', f'{a} {wp[:-1]}en', f'{a2} {wp[:-1]}en']
        cand = [x for x in dict.fromkeys(cand) if x != right]
        pfl.append(mc(f'Perfekt: {pn} ___ ({inf})', right, rg.sample(cand, 3), f'{inf} — {pr} — {p2}; Hilfsverb: {"haben" if aux == "h" else "sein"}. ({ru})'))
rg.shuffle(prl); rg.shuffle(pfl)
add('praeteritum', prl); add('perfekt', pfl)
def table(sel):
    return '; '.join(f'{v[0]} — {v[1]} — {v[3] == "s" and "ist " or ""}{v[2]}' for v in VERBS if v[0] in sel)
T_('praeteritum')['rule'] += ['Stammformen (Infinitiv — Präteritum — Partizip II): ei–ie–ie: ' + table(['bleiben', 'schreiben', 'steigen', 'schneiden', 'streiten', 'leihen', 'scheinen']) + '.',
  'i–a–u: ' + table(['finden', 'singen', 'trinken', 'springen', 'gewinnen', 'schwimmen', 'verschwinden']) + '.',
  'ie/ei–ie… e–a–e/o: ' + table(['geben', 'lesen', 'sehen', 'essen', 'sprechen', 'nehmen', 'treffen', 'helfen', 'werfen']) + '.',
  'a–u–a: ' + table(['fahren', 'tragen', 'schlafen', 'waschen', 'wachsen', 'schlagen']) + '.',
  'gemischte (Vokalwechsel + -te): ' + table(['bringen', 'denken', 'kennen', 'nennen', 'rennen', 'brennen', 'wissen']) + '.']
T_('perfekt')['rule'] += ['С sein: движение и изменение состояния — gehen, fahren, kommen, fliegen, laufen, schwimmen, springen, aufstehen, einschlafen, werden, bleiben, sein, sterben, passieren.',
  'Слабые: ge-…-t (gemacht, gearbeitet); без ge- на -ieren и с неотделяемой приставкой: telefoniert, besucht, bekommen, verstanden. Отделяемые: ge между приставкой и корнем (angerufen, aufgestanden).']

# ---- порядок слов
add('dass', [od(x) for x in ['Ich weiß, dass er heute nicht kommt.', 'Sie sagt, dass das Wetter schön ist.', 'Er glaubt, dass sie recht hat.', 'Ich hoffe, dass du bald kommst.', 'Es ist wichtig, dass wir pünktlich sind.', 'Er meint, dass der Film gut war.', 'Ich finde, dass Deutsch nicht leicht ist.', 'Wir wissen, dass ihr Hunger habt.']])
add('relativ', [od(x) for x in ['Das ist der Mann, der neben mir wohnt.', 'Wo ist das Buch, das ich gestern gekauft habe?', 'Die Frau, die dort arbeitet, ist nett.', 'Ich kenne den Mann, den du gesehen hast.', 'Das ist die Tasche, die ich suche.', 'Der Hund, der bellt, gehört meinem Nachbarn.', 'Ich möchte ein Haus, das einen Garten hat.', 'Das sind die Schuhe, die ich gekauft habe.']])
add('als_wenn', [od(x) for x in ['Wenn es regnet, bleibe ich zu Hause.', 'Als wir Kinder waren, spielten wir draußen.', 'Ich lese, während er kocht.', 'Er kam, obwohl er krank war.', 'Immer wenn ich ihn sehe, lächelt er.', 'Als ich ankam, war niemand da.', 'Während sie schlief, rief er an.', 'Obwohl es kalt ist, gehen wir spazieren.']])
add('umzu', [od(x) for x in ['Ich lerne Deutsch, um in Deutschland zu arbeiten.', 'Sie geht zum Markt, um Obst zu kaufen.', 'Er spart Geld, damit seine Kinder studieren können.', 'Ich rufe an, um einen Termin zu vereinbaren.', 'Wir fahren in die Berge, um Ski zu fahren.', 'Sie schreibt alles auf, damit sie nichts vergisst.']])
add('trennbar', [od(x) for x in ['Der Bus fährt um acht Uhr ab.', 'Ich rufe dich morgen an.', 'Sie macht das Fenster auf.', 'Wir laden unsere Freunde ein.', 'Er sieht abends fern.', 'Ich nehme am Kurs teil.', 'Der Film fängt um neun Uhr an.', 'Sie kommt heute Abend zurück.', 'Wir steigen in Berlin um.']])
add('konj', [od(x) for x in ['Ich habe keine Zeit, deshalb bleibe ich zu Hause.', 'Es regnet, trotzdem gehen wir spazieren.', 'Er ist krank, darum kommt er nicht.', 'Ich möchte ins Kino, aber ich habe kein Geld.', 'Wir können Pizza essen oder wir kochen selbst.', 'Sie lernt viel, deshalb versteht sie alles.']])
add('perfekt', [od(x) for x in ['Wir haben gestern Fußball gespielt.', 'Sie ist nach Berlin gefahren.', 'Er hat den ganzen Tag gearbeitet.', 'Ich bin um sieben Uhr aufgestanden.', 'Hast du schon gegessen?']])
add('praeteritum', [od(x) for x in ['Gestern war ich im Kino.', 'Er ging nach Hause.', 'Wir hatten keine Zeit.', 'Sie kam spät an.']])
add('modal_prat', [od(x) for x in ['Wir wollten gestern ins Kino gehen.', 'Er konnte nicht kommen.', 'Du musstest lange warten.', 'Ich durfte nicht spielen.']])
add('passiv', [od(x) for x in ['Der Tisch wird gedeckt.', 'Die Suppe wird gekocht.', 'Die Fenster werden geputzt.', 'Das Auto wird repariert.']])

# translations of key rules are kept short; reading: topic.items random order
json.dump(T, open(sys.argv[1], 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
print(len(T), 'topics', sum(len(t['items']) for t in T), 'items')

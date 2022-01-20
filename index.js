/*
*   react-native-lisp based on minimal-lisp
*
*   https://github.com/kanaka/miniMAL
*
*   without interop.
*
* */

module.exports = function (s = {}) {
  function f(t, i, n) {
    return (
      (i = Object.create(i)),
      t.some((e, r) =>
        '&' == e ? (i[t[r + 1]] = n.slice(r)) : ((i[e] = n[r]), 0),
      ),
      i
    );
  }
  function c(t, i, e, r, n) {
    for (;;) {
      if (e)
        return Object.keys(t).reduce((e, r) => ((e[r] = c(t[r], i)), e), e);
      if (!Array.isArray(t))
        return typeof '' == typeof t
          ? t in i
            ? i[t]
            : s.throw(t + ' not found')
          : typeof {} == typeof t
          ? t && c(t, i, {})
          : t;
      if ('def' == t[0]) return (i[t[1]] = c(t[2], i));
      if ('~' == t[0]) return Object.assign(c(t[1], i), { M: 1 });
      if ('`' == t[0]) return t[1];
      if ('.-' == t[0])
        return (
          (n = c(t.slice(1), i, [])),
          (x = n[0][n[1]]),
          2 in n ? (n[0][n[1]] = n[2]) : x
        );
      if ('.' == t[0])
        return (
          (n = c(t.slice(1), i, [])),
          (x = n[0][n[1]]),
          x.apply(n[0], n.slice(2))
        );
      if ('try' == t[0])
        try {
          return c(t[1], i);
        } catch (e) {
          return c(t[2][2], f([t[2][1]], i, [e]));
        }
      else {
        if ('fn' == t[0])
          return Object.assign(
            function (...e) {
              return c(t[2], f(t[1], i, e));
            },
            { A: [t[2], i, t[1]] },
          );
        if ('let' == t[0])
          (i = Object.create(i)),
            t[1].map((e, r) => (r % 2 ? (i[t[1][r - 1]] = c(t[1][r], i)) : 0)),
            (t = t[2]);
        else if ('do' == t[0]) c(t.slice(1, -1), i, []), (t = t[t.length - 1]);
        else if ('if' == t[0]) t = c(t[1], i) ? t[2] : t[3];
        else if ((r = c(t[0], i)).M) t = r(...t.slice(1));
        else {
          if (((n = c(t.slice(1), i, [])), !r.A)) return r(...n);
          (t = r.A[0]), (i = f(r.A[2], r.A[1], n));
        }
      }
    }
  }
  return (s = Object.assign(Object.create(s), {
    js: eval,
    eval: (e, r) => c(e, s),
    '=': (e, r) => e === r,
    '<': (e, r) => e < r,
    '+': (e, r) => e + r,
    '-': (e, r) => e - r,
    '*': (e, r) => e * r,
    '/': (e, r) => e / r,
    isa: (e, r) => e instanceof r,
    type: (e, r) => typeof e,
    new: (...e) => new (e[0].bind(...e))(),
    del: (e, r) => delete e[r],
    throw: (e, r) => {
      throw e;
    },
    read: (e, r) => JSON.parse(e),
    rep: (e, r) => JSON.stringify(c(JSON.parse(e), s)),
  }));
};


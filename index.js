module.exports = function (n) {
  function e(n, e) {
    for (; n instanceof Array && n[0] in e && e[n[0]].M; ) n = e[n[0]](...n.slice(1));
    return n;
  }
  function t(n, r) {
    for (;;) {
      if (!(n instanceof Array)) return i(n, r);
      if (((n = e(n, r)), !(n instanceof Array))) return i(n, r);
      if ("def" == n[0]) return (r[n[1]] = t(n[2], r));
      if ("~" == n[0]) {
        let e = t(n[1], r);
        return (e.M = 1), e;
      }
      if ("`" == n[0]) return n[1];
      if (".-" == n[0]) {
        let e = i(n.slice(1), r),
            t = e[0][e[1]];
        return 2 in e ? (e[0][e[1]] = e[2]) : t;
      }
      if ("." == n[0]) {
        let e = i(n.slice(1), r),
            t = e[0][e[1]];
        return t.apply(e[0], e.slice(2));
      }
      if ("try" == n[0])
        try {
          return t(n[1], r);
        } catch (e) {
          return t(n[2][2], i([n[2][1]], r, [e]));
        }
      else if ("fn" == n[0]) {
        let e = function (...e) {
          return t(n[2], i(n[1], r, e));
        };
        return (e.A = [n[2], r, n[1]]), e;
      }
      if ("let" == n[0]) {
        r = Object.create(r);
        for (let e in n[1]) e % 2 && (r[n[1][e - 1]] = t(n[1][e], r));
        n = n[2];
      } else if ("do" == n[0]) {
        let e = i(n.slice(1, n.length - 1), r);
        n = n[n.length - 1];
      } else if ("if" == n[0]) n = t(n[1], r) ? n[2] : n[3];
      else {
        let e = i(n, r),
            t = e[0];
        if (!t.A) return t(...e.slice(1));
        (n = t.A[0]), (r = i(t.A[2], t.A[1], e.slice(1)));
      }
    }
  }
  let i = function (e, i, r) {
    return r
        ? ((i = Object.create(i)), e.some((n, t) => ("&" == n ? (i[e[t + 1]] = r.slice(t)) : ((i[n] = r[t]), 0))), i)
        : e instanceof Array
            ? e.map((...n) => t(n[0], i))
            : typeof "" == typeof e
                ? e in i
                    ? i[e]
                    : n.throw(e + " not found")
                : e;
  };

  const lisp = {
    js: eval,
    evalb: (...e) => t(e[0], n),
    "=": (...n) => n[0] === n[1],
    "<": (...n) => n[0] < n[1],
    "+": (...n) => n[0] + n[1],
    "-": (...n) => n[0] - n[1],
    "*": (...n) => n[0] * n[1],
    "/": (...n) => n[0] / n[1],
    isa: (...n) => n[0] instanceof n[1],
    type: (...n) => typeof n[0],
    new: (...n) => new (n[0].bind(...n))(),
    del: (...n) => delete n[0][n[1]],
    throw: (...n) => {
      throw n[0];
    },
    read: (...n) => JSON.parse(n[0]),
    slurp: (...n) => require("fs").readFileSync(n[0], "utf8"),
    load: (...e) => t(JSON.parse(require("fs").readFileSync(e[0], "utf8")), n),
    rep: (...e) => JSON.stringify(t(JSON.parse(e[0]), n)),
  };

  for (const l in lisp) {
    n[l] = lisp[l]
  }

  return n;

  // return (n = Object.assign(Object.create(n), lisp));
};

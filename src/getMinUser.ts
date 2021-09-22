export const getMinUser = <U extends { end: number | null, name: string }>(users: (U | null)[]) => {
  return users.reduce((u1: U | null, u2: U | null): U | null => {
    const e1 = u1?.end
    const e2 = u2?.end

    if (!e1) {
      if (e2) {
        return u2
      } else {
        return null
      }
    }
    if (!e2) {
      if (e1) {
        return u1
      } else {
        return null
      }
    }
    if (e1 < e2) {
      return u1
    } else if (e1 > e2) {
      return u2
    } else {
      throw new Error('TIE! ' + u1.name + ', ' + u2.name)
    }
  }, null)
}

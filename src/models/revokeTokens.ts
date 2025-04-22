const revokedTokens: Set<string> = new Set()

export const addrevokeTokens = (token: string): void => {
    //console.log('TKEN REVICADO',revokedTokens)
    revokedTokens.add(token)
}

export const isRevokedTokens = (token: string): boolean => revokedTokens.has(token)

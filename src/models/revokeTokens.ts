const revokedTokens: Set<string> = new Set()

export const addrevokeTokens = (token: string): void => {
    revokedTokens.add(token)
}

export const isRevokedTokens = (token: string): boolean => revokedTokens.has(token)

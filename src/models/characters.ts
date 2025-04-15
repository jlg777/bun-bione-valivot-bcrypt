import { minLength, object, pipe, safeParse, string, type InferInput } from "valibot";

export const CharactersSchema = object({
    name: pipe(string(), minLength(6)),
    lastname: pipe(string(), minLength(6))
}) 

export type Character = InferInput<typeof CharactersSchema> & {id: number} 

export const characters: Map<number, Character> = new Map()

// Función para obtener todos los personajes como array
export const getAllCharacters = (): Character[] => {
    return Array.from(characters.values());
  };

  // Función para obtener un personaje por su ID
export const getCharactersByID = (id: number): Character | undefined => {
    return characters.get(id);
  };

export const addCharacters = (character: Character): Character | null=> {

    const validation  = safeParse(CharactersSchema,character)

    if (!validation.success) {
        console.error("Error de validación:", validation.issues);
        return null;
      }

    const newCharacters: Character = {
        ...validation.output,
        id: new Date().getTime()
    }
    characters.set(newCharacters.id, newCharacters)
    return newCharacters
}

export const updateCharacters = (id: number, updatedData: Omit<Character, "id">): Character | null => {
    if (!characters.has(id)) {
      console.error("Character with id:", id, "not found");
      return null;
    }
  
    const validation = safeParse(CharactersSchema, updatedData);
    if (!validation.success) {
      console.error("Error de validación:", validation.issues);
      return null;
    }
  
    const updatedCharacter: Character = {
      ...validation.output,
      id
    };
  
    characters.set(id, updatedCharacter);
    return updatedCharacter;
  };
  

export const deleteCharacters = (id: number): boolean => {
    if(!characters.has(id)){
        console.error('Character with id:', id, 'not found')
        return false
    }  
characters.delete(id)
return true
}
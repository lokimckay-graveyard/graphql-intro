{
  character(id: 583) {
    id
    allegiances {
      name
    }
  }
  house(id: 22) {
    id
    swornMembers {
      aliases
    }
  }
}

# Should produce error

class UsuarioNoEncontrado(Exception):
    pass

class EmailDuplicado(Exception):
    pass

class UserNameDuplicado(Exception):
    pass

class UsuarioDesactivado(Exception):
    pass

class UsuarioYaActivo(Exception):
    pass

class NoPuedeDesactivarseASiMismo(Exception):
    pass

class PedidoAjeno(Exception):
    pass
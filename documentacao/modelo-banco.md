# Modelo de Banco de Dados — ApiHub

## Diagrama de Entidade-Relacionamento (descritivo)

```
USUARIO ──< APIARIO ──< COLMEIA >── RAINHA
                              |
                              └──< INSPECAO
```

---

## Entidades e Atributos

### USUARIO
| Atributo | Tipo | Restrição |
|----------|------|-----------|
| id | BIGINT | PK, AUTO_INCREMENT |
| username | VARCHAR(50) | NOT NULL, UNIQUE |
| password | VARCHAR(100) | NOT NULL (hash bcrypt) |

---

### APIARIO
| Atributo | Tipo | Restrição |
|----------|------|-----------|
| id | BIGINT | PK, AUTO_INCREMENT |
| apiary_name | VARCHAR(100) | NOT NULL |
| city | VARCHAR(100) | NOT NULL |
| registration_number | VARCHAR(50) | NOT NULL |
| territory_registration | VARCHAR(50) | NOT NULL |
| description | VARCHAR(500) | NULL |
| latitude | DOUBLE | NOT NULL (-90 a 90) |
| longitude | DOUBLE | NOT NULL (-180 a 180) |
| usuario_id | BIGINT | FK → USUARIO(id) |

---

### COLMEIA
| Atributo | Tipo | Restrição |
|----------|------|-----------|
| id | BIGINT | PK, AUTO_INCREMENT |
| name | VARCHAR(100) | NOT NULL |
| frame_type | VARCHAR(50) | NOT NULL |
| colony_origin | VARCHAR(100) | NOT NULL |
| box_count | INT | NOT NULL |
| apiario_id | BIGINT | FK → APIARIO(id) |

---

### RAINHA
| Atributo | Tipo | Restrição |
|----------|------|-----------|
| id | BIGINT | PK, AUTO_INCREMENT |
| identification_number | VARCHAR(50) | NOT NULL |
| origin | VARCHAR(100) | NOT NULL |
| breed | VARCHAR(50) | NOT NULL |
| color | VARCHAR(30) | NOT NULL |
| birth_date | DATE | NOT NULL |
| colmeia_id | BIGINT | FK → COLMEIA(id), UNIQUE |

---

### INSPECAO
| Atributo | Tipo | Restrição |
|----------|------|-----------|
| id | BIGINT | PK, AUTO_INCREMENT |
| inspection_date | DATE | NOT NULL |
| queen_seen | BOOLEAN | NOT NULL |
| eggs_seen | BOOLEAN | NOT NULL |
| queen_cells_seen | BOOLEAN | NOT NULL |
| queenless | BOOLEAN | NOT NULL |
| brood_pattern | VARCHAR(100) | NOT NULL |
| colony_strength | VARCHAR(50) | NOT NULL |
| observations | VARCHAR(1000) | NULL |
| colmeia_id | BIGINT | FK → COLMEIA(id) |

---

## Relacionamentos

| Relacionamento | Tipo | Descrição |
|----------------|------|-----------|
| USUARIO → APIARIO | 1:N | Um usuário pode ter vários apiários |
| APIARIO → COLMEIA | 1:N | Um apiário pode ter várias colmeias |
| COLMEIA → RAINHA | 1:1 | Cada colmeia possui exatamente uma rainha |
| COLMEIA → INSPECAO | 1:N | Uma colmeia pode ter várias inspeções ao longo do tempo |

## Chaves

- **Chaves Primárias (PK)**: id em todas as tabelas (geração automática)
- **Chaves Estrangeiras (FK)**:
  - `APIARIO.usuario_id` → `USUARIO.id` (cascade delete)
  - `COLMEIA.apiario_id` → `APIARIO.id` (cascade delete)
  - `RAINHA.colmeia_id` → `COLMEIA(id)` (cascade delete, unique)
  - `INSPECAO.colmeia_id` → `COLMEIA(id)` (cascade delete)

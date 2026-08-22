class_name CombatActor
extends CharacterBody2D

signal died(actor: CombatActor)

var team: StringName = &"neutral"
var max_hp: float = 100.0
var hp: float = 100.0
var move_speed: float = 120.0
var body_radius: float = 18.0
var display_name: String = "Actor"
var base_color: Color = Color.WHITE
var outline_color: Color = Color(0.08, 0.08, 0.10)
var dead: bool = false
var hit_flash: float = 0.0
var knockback_velocity: Vector2 = Vector2.ZERO
var last_overkill_ratio: float = 1.0

func _ready() -> void:
	queue_redraw()

func _physics_process(delta: float) -> void:
	if hit_flash > 0.0:
		hit_flash = maxf(0.0, hit_flash - delta)
		queue_redraw()
	if knockback_velocity.length_squared() > 1.0:
		velocity += knockback_velocity
		knockback_velocity = knockback_velocity.move_toward(Vector2.ZERO, 850.0 * delta)

func take_damage(amount: float, source: Node = null, crit: bool = false) -> void:
	if dead:
		return
	var remaining_before := hp
	hp -= amount
	hit_flash = 0.07 if not crit else 0.11
	queue_redraw()
	var scene := get_tree().current_scene
	if scene != null and scene.has_method("spawn_damage_number"):
		scene.call("spawn_damage_number", global_position, amount, crit)
	if hp <= 0.0:
		last_overkill_ratio = amount / maxf(1.0, remaining_before)
		die(source)

func heal(amount: float) -> void:
	if dead:
		return
	hp = minf(max_hp, hp + amount)
	queue_redraw()

func apply_knockback(direction: Vector2, strength: float) -> void:
	if dead:
		return
	knockback_velocity += direction.normalized() * strength

func die(source: Node = null) -> void:
	if dead:
		return
	dead = true
	velocity = Vector2.ZERO
	died.emit(self)
	var scene := get_tree().current_scene
	if scene != null and scene.has_method("register_kill"):
		scene.call("register_kill", self, source)
	var tween := create_tween()
	var launch := clampf((last_overkill_ratio - 1.0) * 14.0, 0.0, 48.0)
	if launch > 0.0 and source is Node2D:
		var source_2d := source as Node2D
		var away := (global_position - source_2d.global_position).normalized()
		tween.parallel().tween_property(self, "position", position + away * launch, 0.16)
	tween.parallel().tween_property(self, "scale", Vector2.ONE * (1.0 + minf(last_overkill_ratio * 0.08, 0.35)), 0.08)
	tween.tween_property(self, "modulate:a", 0.0, 0.18)
	tween.tween_callback(queue_free)

func health_ratio() -> float:
	return hp / maxf(1.0, max_hp)

func _draw() -> void:
	var draw_color := Color.WHITE if hit_flash > 0.0 else base_color
	draw_circle(Vector2.ZERO, body_radius, outline_color)
	draw_circle(Vector2.ZERO, body_radius - 3.0, draw_color)
	var bar_width := body_radius * 2.0
	var bar_pos := Vector2(-body_radius, -body_radius - 10.0)
	draw_rect(Rect2(bar_pos, Vector2(bar_width, 4.0)), Color(0.15, 0.05, 0.05))
	draw_rect(Rect2(bar_pos, Vector2(bar_width * health_ratio(), 4.0)), Color(0.25, 0.90, 0.35))

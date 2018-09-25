# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2018_09_25_195700) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "annotations", force: :cascade do |t|
    t.integer "passage_id"
    t.string "original_spanish"
    t.string "annotation_content"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "element"
    t.integer "made_by"
    t.integer "in_update"
    t.string "main_content"
  end

  create_table "document_passages", force: :cascade do |t|
    t.integer "document_id"
    t.integer "passage_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "documents", force: :cascade do |t|
    t.string "title"
    t.integer "author_user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "passage_shares", force: :cascade do |t|
    t.integer "author_user_id"
    t.integer "recieving_user_id"
    t.integer "passage_id"
    t.boolean "edit_privilege"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "message"
    t.boolean "opened"
    t.datetime "opened_at"
  end

  create_table "passages", force: :cascade do |t|
    t.integer "user_id"
    t.string "title"
    t.string "content"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "made_by"
    t.integer "in_update"
    t.string "main_content"
  end

  create_table "update_tracks", force: :cascade do |t|
    t.integer "last_user_id"
    t.integer "passage_id"
    t.string "annotation_code"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "nature"
    t.string "main_content"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string "unconfirmed_email"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "first_name"
    t.string "last_name"
    t.integer "made_by"
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

end

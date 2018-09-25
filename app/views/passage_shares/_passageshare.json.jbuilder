json.extract! passageshare, :id, :author_user_id, :recieving_user_id, :passage_id, :edit_privilege, :created_at, :updated_at
json.url passageshare_url(passageshare, format: :json)

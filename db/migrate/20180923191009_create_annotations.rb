class CreateAnnotations < ActiveRecord::Migration[5.2]
  def change
    create_table :annotations do |t|
      t.integer :passage_id
      t.string :original_spanish
      t.string :annotation_content

      t.timestamps
    end
  end
end
